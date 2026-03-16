import { Teacher } from "../models/teacher.entity";


export const TEACHER_REPOSITORY = Symbol("TEACHER_REPOSITORY"); 

export interface TeacherRepository {
    create(teacher: Teacher): Promise<void>;
    update(teacher: Teacher): Promise<void>;
    delete(id: string): Promise<void>;
    findAll(): Promise<Teacher[]>;
    findById(id: string): Promise<Teacher | null>;
    findByEmail(email: string): Promise<Teacher | null>;
    //findByRA(registration: string): Promise<Teacher | null>;
    //findByDocument(document: string): Promise<Teacher | null>;
}