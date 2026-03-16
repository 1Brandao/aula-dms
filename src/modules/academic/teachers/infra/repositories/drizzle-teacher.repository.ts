import { Teacher } from "@academic/teachers/domain/models/teacher.entity";
import { DrizzleService } from "@infra/database/drizzle.service";
import { Injectable } from "@nestjs/common";
import { teacherSchema } from "../database/schemas/teacher.schema";
import { eq } from "drizzle-orm";
import type { TeacherRepository } from "@academic/teachers/domain/repositories/teacher-repository.interface";

@Injectable()
export class DrizzleTeacherRepository implements TeacherRepository {
    constructor(private readonly drizzleService: DrizzleService) {}

    async create(teacher: Teacher): Promise<void>{
        await this.drizzleService.db.insert(teacherSchema).values({
            name: teacher.name,
            email: teacher.email,
            document: teacher.document,
            registration: teacher.registration,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    async update(teacher: Teacher): Promise<void> {
        await this.drizzleService.db.update(teacherSchema).set({
            name: teacher.name,
            email: teacher.email,
            document: teacher.document,
            registration: teacher.registration,
            updatedAt: new Date(),
        }).where(eq(teacherSchema.id, teacher.id!));
    }

    async delete(id: string): Promise<void> {
        await this.drizzleService.db.
        delete(teacherSchema)
        .where(eq(teacherSchema.id, id));
    }

    async findById(id: string): Promise<Teacher | null> {
        const result = await this.drizzleService.db
        .select()
        .from(teacherSchema)
        .where(eq(teacherSchema.id, id))
        .limit(1);

        return Teacher.restore(result[0]);
    }

    async findByEmail(email: string): Promise<Teacher | null> {
        const result = await this.drizzleService.db
        .select()
        .from(teacherSchema)
        .where(eq(teacherSchema.email, email.toLowerCase()))
        .limit(1);

        return Teacher.restore(result[0]);
    }

    async findAll(): Promise<Teacher[]> {
        const rows = await this.drizzleService.db
        .select()
        .from(teacherSchema)
        return rows.map((row) => Teacher.restore(row)!);
    }

}
