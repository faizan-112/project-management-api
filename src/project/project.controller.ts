import { 
  Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, NotFoundException, ForbiddenException
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ProjectService } from './project.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)  
  @Post()
  async create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
      console.log('Authenticated User:', req.user);  
      
      if (!req.user || !req.user.id) {
          throw new ForbiddenException('User not authenticated or missing userId');
      }

      return this.projectService.createProject(createProjectDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard) 
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.projectService.findOne(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)  
  @Roles('admin', 'owner')
  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    console.log('Update request by:', req.user?.id);  

    return this.projectService.update(id, updateProjectDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)  
  @Roles('admin', 'owner') 
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    console.log('Delete request by:', req.user?.id);  

    return this.projectService.remove(id, req.user.id);
  }
}