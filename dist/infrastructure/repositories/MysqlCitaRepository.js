"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlCitaRepository = void 0;
const Cita_1 = require("../../domain/entities/Cita");
const mysql_1 = require("../database/mysql");
class MysqlCitaRepository {
    async findById(id) {
        const [rows] = await mysql_1.pool.query("SELECT * FROM citas WHERE id = ?", [id]);
        if (rows.length === 0)
            return null;
        const row = rows[0];
        return new Cita_1.Cita(row.id, row.medico_id, row.paciente_id, new Date(row.fecha_hora), row.estado);
    }
    async save(cita) {
        const [result] = await mysql_1.pool.query("INSERT INTO citas (medico_id, paciente_id, fecha_hora, estado) VALUES (?, ?, ?, ?)", [cita.medicoId, cita.pacienteId, cita.fechaHora, cita.estado]);
        return new Cita_1.Cita(result.insertId, cita.medicoId, cita.pacienteId, cita.fechaHora, cita.estado);
    }
    async update(cita) {
        await mysql_1.pool.query("UPDATE citas SET fecha_hora = ?, estado = ? WHERE id = ?", [cita.fechaHora, cita.estado, cita.id]);
    }
    async findActivasByMedicoAndDate(medicoId, fecha) {
        // Buscar todas las citas del medico en el mismo día (ignorando horas)
        const initDate = new Date(fecha).setHours(0, 0, 0, 0);
        const endDate = new Date(fecha).setHours(23, 59, 59, 999);
        const [rows] = await mysql_1.pool.query("SELECT * FROM citas WHERE medico_id = ? AND estado = 'ACTIVA' AND fecha_hora BETWEEN ? AND ?", [medicoId, new Date(initDate), new Date(endDate)]);
        return rows.map((row) => new Cita_1.Cita(row.id, row.medico_id, row.paciente_id, new Date(row.fecha_hora), row.estado));
    }
    async findByMedicoAndDateRange(medicoId, inicio, fin) {
        const [rows] = await mysql_1.pool.query("SELECT * FROM citas WHERE medico_id = ? AND estado = 'ACTIVA' AND ((fecha_hora >= ? AND fecha_hora < ?) OR (DATE_ADD(fecha_hora, INTERVAL 30 MINUTE) > ? AND DATE_ADD(fecha_hora, INTERVAL 30 MINUTE) <= ?))", [medicoId, inicio, fin, inicio, fin]);
        return rows.map((row) => new Cita_1.Cita(row.id, row.medico_id, row.paciente_id, new Date(row.fecha_hora), row.estado));
    }
}
exports.MysqlCitaRepository = MysqlCitaRepository;
