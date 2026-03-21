import type { User } from "@users/domain/models/user.entity";

export class UserDto {
  private constructor(
    public id: string,
    public email: string,
    public teacherId: string | null,
    public permissions: string[],
  ) {}

  static from(user: User | null): UserDto | null {
    if (!user || !user.id) return null;

    return new UserDto(
      user.id,
      user.email,
      user.teacherId ?? null,
      user.permissions,
    );
  }
}
