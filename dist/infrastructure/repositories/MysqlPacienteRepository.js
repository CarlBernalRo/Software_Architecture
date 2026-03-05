"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlPacienteRepository = void 0;
const Paciente_1 = require("../../domain/entities/Paciente");
const mysql_1 = require("../database/mysql");
class MysqlPacienteRepository {
    async findById(id) {
        const [rows] = await mysql_1.pool.query("SELECT * FROM pacientes WHERE id = ?", [id]);
        if (rows.length === 0)
            return null;
        const row = rows[0];
        return new Paciente_1.Paciente(row.id, row.nombre, row.documento, row.correo);
    }
    async save(paciente) {
        const [result] = await mysql_1.pool.query("INSERT INTO pacientes (nombre, documento, correo) VALUES (?, ?, ?)", [paciente.nombre, paciente.documento, paciente.correo]);
        return new Paciente_1.Paciente(result.insertId, paciente.nombre, paciente.documento, paciente.correo);
    }
    async findAll() {
        const [rows] = await mysql_1.pool.query("SELECT * FROM pacientes");
        return rows.map((row) => new Paciente_1.Paciente(row.id, row.nombre, row.documento, row.correo));
    }
}
exports.MysqlPacienteRepository = MysqlPacienteRepository;
