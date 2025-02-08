import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({ data: createTaskDto });
  }

  async findAll() {
    return this.prisma.task.findMany();
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }

  
  async findFiltered(status?: string, assignedUserId?: string) {
    return this.prisma.task.findMany({
      where: {
        status: status ? (status as 'TODO' | 'IN_PROGRESS' | 'DONE') : undefined,
        assignedUserId: assignedUserId || undefined,
      },
    });
  }

  
  async findByProject(projectId: string, status?: string) {
    return this.prisma.task.findMany({
      where: {
        projectId,
        status: status ? (status as 'TODO' | 'IN_PROGRESS' | 'DONE') : undefined,
      },
    });
  }
}