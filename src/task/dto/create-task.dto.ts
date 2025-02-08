export class CreateTaskDto {
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    projectId: string;
    assignedUserId: string;
  }