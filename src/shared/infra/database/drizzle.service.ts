import * as studentSchema from "@academic/students/infra/database/schemas/student.schema";
import * as teacherSchema from "@academic/teachers/infra/database/schemas/teacher.schema";
import { Injectable, type OnModuleDestroy } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  private readonly pool: Pool;
  public readonly db;
  private readonly schema = { ...studentSchema, ...teacherSchema };

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    
    this.db = drizzle(this.pool, {schema: this.schema});
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
