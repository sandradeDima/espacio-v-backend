"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.findByReporte = findByReporte;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.removeByReporte = removeByReporte;
const pool_1 = require("../db/pool");
async function findAll() {
    const [rows] = await pool_1.pool.execute('SELECT id, reporte_id as reporteId, filename, created_at as createdAt, updated_at as updatedAt FROM fotos_reportes ORDER BY created_at DESC');
    return rows;
}
async function findById(id) {
    const [rows] = await pool_1.pool.execute('SELECT id, reporte_id as reporteId, filename, created_at as createdAt, updated_at as updatedAt FROM fotos_reportes WHERE id = ?', [id]);
    return rows[0] ?? null;
}
async function findByReporte(reporteId) {
    const [rows] = await pool_1.pool.execute('SELECT id, reporte_id as reporteId, filename, created_at as createdAt, updated_at as updatedAt FROM fotos_reportes WHERE reporte_id = ? ORDER BY created_at', [reporteId]);
    return rows;
}
async function create(reporteId, filename) {
    const [result] = await pool_1.pool.execute('INSERT INTO fotos_reportes (reporte_id, filename) VALUES (?, ?)', [reporteId, filename]);
    const foto = await findById(result.insertId);
    if (!foto)
        throw new Error('Failed to create foto reporte');
    return foto;
}
async function update(id, reporteId, filename) {
    const [result] = await pool_1.pool.execute('UPDATE fotos_reportes SET reporte_id = ?, filename = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [reporteId, filename, id]);
    if (result.affectedRows === 0)
        return null;
    return await findById(id);
}
async function remove(id) {
    const [result] = await pool_1.pool.execute('DELETE FROM fotos_reportes WHERE id = ?', [id]);
    return result.affectedRows > 0;
}
async function removeByReporte(reporteId) {
    const [result] = await pool_1.pool.execute('DELETE FROM fotos_reportes WHERE reporte_id = ?', [reporteId]);
    return result.affectedRows;
}
