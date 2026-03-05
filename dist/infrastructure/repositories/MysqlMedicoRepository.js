"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlMedicoRepository = void 0;
const Medico_1 = require("../../domain/entities/Medico");
const mysql_1 = require("../database/mysql");
class MysqlMedicoRepository {
    async findById(id) {
        const [rows] = await mysql_1.pool.query("SELECT * FROM medicos WHERE id = ?", [id]);
        if (rows.length === 0)
            return null;
        const row = rows[0];
        return new Medico_1.Medico(row.id, row.nombre, row.especialidad, row.licencia);
    }
    async save(medico) {
        const [result] = await mysql_1.pool.query("INSERT INTO medicos (nombre, especialidad, licencia) VALUES (?, ?, ?)", [medico.nombre, medico.especialidad, medico.licencia]);
        return new Medico_1.Medico(result.insertId, medico.nombre, medico.especialidad, medico.licencia);
    }
    async findAll() {
        const [rows] = await mysql_1.pool.query("SELECT * FROM medicos");
        return rows.map((row) => new Medico_1.Medico(row.id, row.nombre, row.especialidad, row.licencia));
    }
}
exports.MysqlMedicoRepository = MysqlMedicoRepository;
