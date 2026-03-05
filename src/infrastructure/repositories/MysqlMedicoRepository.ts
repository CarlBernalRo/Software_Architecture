import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { Medico } from "../../domain/entities/Medico";
import { IMedicoRepository } from "../../domain/repositories/IMedicoRepository";
import { pool } from "../database/mysql";

export class MysqlMedicoRepository implements IMedicoRepository {
    async findById(id: number): Promise<Medico | null> {
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM medicos WHERE id = ?", [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return new Medico(row.id, row.nombre, row.especialidad, row.licencia);
    }

    async save(medico: Omit<Medico, "id">): Promise<Medico> {
        const [result] = await pool.query<ResultSetHeader>(
            "INSERT INTO medicos (nombre, especialidad, licencia) VALUES (?, ?, ?)",
            [medico.nombre, medico.especialidad, medico.licencia]
        );
        return new Medico(result.insertId, medico.nombre, medico.especialidad, medico.licencia);
    }

    async findAll(): Promise<Medico[]> {
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM medicos");
        return rows.map((row) => new Medico(row.id, row.nombre, row.especialidad, row.licencia));
    }
}
