import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { Paciente } from "../../domain/entities/Paciente";
import { IPacienteRepository } from "../../domain/repositories/IPacienteRepository";
import { pool } from "../database/mysql";

export class MysqlPacienteRepository implements IPacienteRepository {
    async findById(id: number): Promise<Paciente | null> {
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM pacientes WHERE id = ?", [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return new Paciente(row.id, row.nombre, row.documento, row.correo);
    }

    async save(paciente: Omit<Paciente, "id">): Promise<Paciente> {
        const [result] = await pool.query<ResultSetHeader>(
            "INSERT INTO pacientes (nombre, documento, correo) VALUES (?, ?, ?)",
            [paciente.nombre, paciente.documento, paciente.correo]
        );
        return new Paciente(result.insertId, paciente.nombre, paciente.documento, paciente.correo);
    }

    async findAll(): Promise<Paciente[]> {
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM pacientes");
        return rows.map((row) => new Paciente(row.id, row.nombre, row.documento, row.correo));
    }
}
