export class UpdateProjectDto {
    name?: string;
    description?: string;
    status?: 'PLANNED' | 'ONGOING' | 'COMPLETED';
  }