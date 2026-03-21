import { type Permission } from "@shared/domain/enums/permission.enum";

export interface CreateUserDto {
  email: string;
  password: string;
  teacherId?: string;
  permissions: Permission[];
}
