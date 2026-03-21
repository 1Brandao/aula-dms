import { CreateUserDto } from "@users/application/dto/create-user.dto";
import { UserDto } from "@users/application/dto/user.dto";
import type { UserPayloadDto } from "@users/application/dto/user-payload.dto";
import { User } from "@users/domain/models/user.entity";
import {
  USER_REPOSITORY,
  type UserRepository,
} from "@users/domain/repositories/user-repository.interface";
import bcrypt from "bcryptjs";
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) throw new ConflictException("Email already registered");

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = User.restore({
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      teacherId: dto.teacherId,
      permissions: dto.permissions,
    });

    await this.userRepository.create(user!);
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => UserDto.from(user)!);
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findById(id);
    const dto = UserDto.from(user);

    if (!dto) throw new NotFoundException("User not found");
    return dto;
  }

  async update(id: string, dto: Partial<CreateUserDto>): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new NotFoundException("User not found");

    if (dto.email && dto.email.toLowerCase() !== existing.email) {
      const emailInUse = await this.userRepository.findByEmail(dto.email);
      if (emailInUse && emailInUse.id !== id) {
        throw new ConflictException("Email already registered");
      }
      existing.withEmail(dto.email.toLowerCase());
    }

    if (dto.password) {
      existing.withPassword(await bcrypt.hash(dto.password, 10));
    }

    if (dto.teacherId !== undefined) {
      existing.withTeacherId(dto.teacherId);
    }

    if (dto.permissions) {
      existing.withPermissions(dto.permissions as string[]);
    }

    await this.userRepository.update(existing);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new NotFoundException("User not found");

    await this.userRepository.delete(id);
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserPayloadDto | null> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    return {
      id: user.id!,
      email: user.email,
      permissions: user.permissions,
    };
  }
}
