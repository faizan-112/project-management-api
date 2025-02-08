import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ForbiddenException
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard)  
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    console.log('Authenticated User:', req.user);  

    if (!req.user || !req.user.id) {
        throw new ForbiddenException('User not authenticated or missing userId');
    }

    return this.taskService.create(createTaskDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query('status') status?: string) {
    return this.taskService.findFiltered(req.user.id, status); 
  }

  @Get('projects/:projectId') 
  findByProject(@Request() req, @Param('projectId') projectId: string, @Query('status') status?: string) {
    return this.taskService.findByProject(projectId, req.user.id, status); 
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.taskService.findOne(id, req.user.id);
  }

  @UseGuards(RolesGuard)  
  @Roles('admin', 'owner', 'manager')
  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)  
  @Roles('admin', 'owner') 
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.taskService.remove(id, req.user.id);
  }
}