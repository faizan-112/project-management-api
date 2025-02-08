import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const { params } = request;

    // 🔹 Task Authorization
    if (params.id && request.route.path.includes('tasks')) {
      const task = await this.prisma.task.findUnique({
        where: { id: params.id },
        include: { assignedUser: true },
      });

      if (!task || task.assignedUser?.id !== user.id) {
        throw new ForbiddenException('You are not allowed to update this task');
      }
    }

    // 🔹 Project Authorization
    if (params.id && request.route.path.includes('projects')) {
      const project = await this.prisma.project.findUnique({
        where: { id: params.id },
        include: { user: true },
      });

      if (!project || project.user?.id !== user.id) { 
        throw new ForbiddenException('You are not allowed to update this project');
      }
    }

    return true;
  }
}