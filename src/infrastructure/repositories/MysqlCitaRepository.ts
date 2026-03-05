import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { Cita, EstadoCita } from "../../domain/entities/Cita";
import { ICitaRepository } from "../../domain/repositories/ICitaRepository";
import { pool } from "../database/mysql";

export class MysqlCitaRepository implements ICitaRepository {
    async findById(id: number): Promise<Cita | null> {
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM citas WHERE id = ?", [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return new Cita(row.id, row.medico_id, row.paciente_id, new Date(row.fecha_hora), row.estado as EstadoCita);
    }

    async save(cita: Omit<Cita, "id">): Promise<Cita> {
        const [result] = await pool.query<ResultSetHeader>(
            "INSERT INTO citas (medico_id, paciente_id, fecha_hora, estado) VALUES (?, ?, ?, ?)",
            [cita.medicoId, cita.pacienteId, cita.fechaHora, cita.estado]
        );
        return new Cita(result.insertId, cita.medicoId, cita.pacienteId, cita.fechaHora, cita.estado);
    }

    async update(cita: Cita): Promise<void> {
        await pool.query(
            "UPDATE citas SET fecha_hora = ?, estado = ? WHERE id = ?",
            [cita.fechaHora, cita.estado, cita.id]
        );
    }

    async findActivasByMedicoAndDate(medicoId: number, fecha: Date): Promise<Cita[]> {
        // Buscar todas las citas del medico en el mismo día (ignorando horas)
        const initDate = new Date(fecha).setHours(0, 0, 0, 0);
        const endDate = new Date(fecha).setHours(23, 59, 59, 999);

        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM citas WHERE medico_id = ? AND estado = 'ACTIVA' AND fecha_hora BETWEEN ? AND ?",
            [medicoId, new Date(initDate), new Date(endDate)]
        );
        return rows.map((row) => new Cita(row.id, row.medico_id, row.paciente_id, new Date(row.fecha_hora), row.estado as EstadoCita));
    }

    async findByMedicoAndDateRange(medicoId: number, inicio: Date, fin: Date): Promise<Cita[]> {
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM citas WHERE medico_id = ? AND estado = 'ACTIVA' AND ((fecha_hora >= ? AND fecha_hora < ?) OR (DATE_ADD(fecha_hora, INTERVAL 30 MINUTE) > ? AND DATE_ADD(fecha_hora, INTERVAL 30 MINUTE) <= ?))",
            [medicoId, inicio, fin, inicio, fin]
        );
        return rows.map((row) => new Cita(row.id, row.medico_id, row.paciente_id, new Date(row.fecha_hora), row.estado as EstadoCita));
    }
}
