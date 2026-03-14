import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { Cita, EstadoCita } from "../../domain/entities/Cita";
import { ICitaRepository } from "../../domain/repositories/ICitaRepository";
import { pool } from "../database/mysql";

export class MysqlCitaRepository implements ICitaRepository {
    async findById(id: number): Promise<Cita | null> {
        const query = `
            SELECT 
                c.*, 
                m.nombre as medico_nombre, m.especialidad as medico_especialidad, m.licencia as medico_licencia,
                p.nombre as paciente_nombre, p.documento as paciente_documento, p.correo as paciente_correo
            FROM citas c
            LEFT JOIN medicos m ON c.medico_id = m.id
            LEFT JOIN pacientes p ON c.paciente_id = p.id
            WHERE c.id = ?
        `;
        const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        const cita = new Cita(row.id, row.medico_id, row.paciente_id, new Date(row.fecha_hora), row.estado as EstadoCita);
        if (row.medico_nombre) {
            cita.medico = { id: row.medico_id, nombre: row.medico_nombre, especialidad: row.medico_especialidad, licencia: row.medico_licencia };
        }
        if (row.paciente_nombre) {
            cita.paciente = { id: row.paciente_id, nombre: row.paciente_nombre, documento: row.paciente_documento, correo: row.paciente_correo };
        }
        return cita;
    }

    async findAll(): Promise<Cita[]> {
        const query = `
            SELECT 
                c.*, 
                m.nombre as medico_nombre, m.especialidad as medico_especialidad, m.licencia as medico_licencia,
                p.nombre as paciente_nombre, p.documento as paciente_documento, p.correo as paciente_correo
            FROM citas c
            LEFT JOIN medicos m ON c.medico_id = m.id
            LEFT JOIN pacientes p ON c.paciente_id = p.id
            ORDER BY c.fecha_hora DESC
        `;
        const [rows] = await pool.query<RowDataPacket[]>(query);
        
        return rows.map(row => {
            const cita = new Cita(row.id, row.medico_id, row.paciente_id, new Date(row.fecha_hora), row.estado as EstadoCita);
            if (row.medico_nombre) {
                cita.medico = { id: row.medico_id, nombre: row.medico_nombre, especialidad: row.medico_especialidad, licencia: row.medico_licencia };
            }
            if (row.paciente_nombre) {
                cita.paciente = { id: row.paciente_id, nombre: row.paciente_nombre, documento: row.paciente_documento, correo: row.paciente_correo };
            }
            return cita;
        });
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
            "UPDATE citas SET fecha_hora = ?, estado = ?, medico_id = ? WHERE id = ?",
            [cita.fechaHora, cita.estado, cita.medicoId, cita.id]
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
