import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({ 
      data: {
        ...createTaskDto,
        assignedUserId: userId, 
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { assignedUserId: userId },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Task not found');
    if (task.assignedUserId !== userId) throw new ForbiddenException('Access denied');

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Task not found'); 
    if (task.assignedUserId !== userId) throw new ForbiddenException('You cannot update this task');

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });

    if (!task) throw new NotFoundException('Task not found'); 
    if (task.assignedUserId !== userId) throw new ForbiddenException('You cannot delete this task');

    return this.prisma.task.delete({ where: { id } });
  }

  async findFiltered(userId: string, status?: string) {
    return this.prisma.task.findMany({
      where: {
        assignedUserId: userId,  
        status: status ? (status as 'TODO' | 'IN_PROGRESS' | 'DONE') : undefined,
      },
    });
  }

  async findByProject(projectId: string, userId: string, status?: string) {
    return this.prisma.task.findMany({
      where: {
        projectId,
        assignedUserId: userId, 
        status: status ? (status as 'TODO' | 'IN_PROGRESS' | 'DONE') : undefined,
      },
    });
  }
}