import type { Teacher } from "@academic/teachers/domain/models/teacher.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateTeacherDto {
  @ApiProperty({ example: "Maria Souza" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  specialization: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  admissionDate: Date;
}

export class UpdateTeacherDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  document?: string;

  @IsString()
  @IsOptional()
  degree?: string;

  @IsString()
  @IsOptional()
  specialization?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  admissionDate?: Date;
}

export class TeacherDto {
  private constructor(
    public id: string | undefined,
    public name: string,
    public email: string,
    public document: string,
    public degree: string,
    public specialization: string,
    public admissionDate: Date,
  ) {}

  public static fromTeacher(teacher: Teacher | null): TeacherDto | null {
    if (!teacher) return null;
    return new TeacherDto(
      teacher.id,
      teacher.name,
      teacher.email,
      teacher.document,
      teacher.degree,
      teacher.specialization,
      teacher.admissionDate,
    );
  }
}
