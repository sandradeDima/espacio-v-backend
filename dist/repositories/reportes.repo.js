"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.findByCliente = findByCliente;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.findByDateRange = findByDateRange;
const pool_1 = require("../db/pool");
async function findAll() {
    const [rows] = await pool_1.pool.execute(`SELECT 
            r.id, 
            r.cliente_id as clienteId, 
            DATE_FORMAT(r.fecha_servicio, '%Y-%m-%d') as fechaServicio, 
            r.hora_servicio as horaServicio,
            r.formula,
            r.observaciones,
            r.precio,
            r.created_at as createdAt,
            r.updated_at as updatedAt,
            c.nombre as clienteNombre,
            c.email as clienteEmail,
            col.nombre as coloracion,
            col.descripcion as coloracion_desc
        FROM reportes r
        LEFT JOIN clientes c ON r.cliente_id = c.id
        LEFT JOIN coloraciones col ON r.coloracion_id = col.id
        ORDER BY r.fecha_servicio DESC, r.hora_servicio DESC`);
    return rows;
}
async function findById(id) {
    const [rows] = await pool_1.pool.execute(`SELECT 
            r.id, 
            r.cliente_id as clienteId, 
            DATE_FORMAT(r.fecha_servicio, '%Y-%m-%d') as fechaServicio, 
            r.hora_servicio as horaServicio,
            r.formula,
            r.observaciones,
            r.precio,
            r.created_at as createdAt,
            r.updated_at as updatedAt,
            c.nombre as clienteNombre,
            c.email as clienteEmail,
            col.nombre as coloracion,
            col.descripcion as coloracion_desc
        FROM reportes r
        LEFT JOIN clientes c ON r.cliente_id = c.id
        LEFT JOIN coloraciones col ON r.coloracion_id = col.id
        WHERE r.id = ?`, [id]);
    return rows[0] ?? null;
}
async function findByCliente(clienteId) {
    const [rows] = await pool_1.pool.execute(`SELECT 
            r.id, 
            r.cliente_id as clienteId, 
            DATE_FORMAT(r.fecha_servicio, '%Y-%m-%d') as fechaServicio, 
            r.hora_servicio as horaServicio,
            r.formula,
            r.observaciones,
            r.precio,
            r.created_at as createdAt,
            r.updated_at as updatedAt,
            c.nombre as clienteNombre,
            c.email as clienteEmail,
            col.nombre as coloracion,
            col.descripcion as coloracion_desc
        FROM reportes r
        LEFT JOIN clientes c ON r.cliente_id = c.id
        LEFT JOIN coloraciones col ON r.coloracion_id = col.id
        WHERE r.cliente_id = ?
        ORDER BY r.fecha_servicio DESC, r.hora_servicio DESC`, [clienteId]);
    return rows;
}
async function create(clienteId, fechaServicio, horaServicio, coloracionId, formula, observaciones, precio) {
    const [result] = await pool_1.pool.execute('INSERT INTO reportes (cliente_id, fecha_servicio, hora_servicio, coloracion_id, formula, observaciones, precio) VALUES (?, ?, ?, ?, ?, ?, ?)', [clienteId, fechaServicio, horaServicio, coloracionId, formula, observaciones, precio]);
    const reporte = await findById(result.insertId);
    if (!reporte)
        throw new Error('Failed to create reporte');
    return reporte;
}
async function update(id, clienteId, coloracionId, formula, observaciones, precio) {
    const [result] = await pool_1.pool.execute('UPDATE reportes SET cliente_id = ?, coloracion_id = ?, formula = ?, observaciones = ?, precio = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [clienteId, coloracionId, formula, observaciones, precio, id]);
    if (result.affectedRows === 0)
        return null;
    return await findById(id);
}
async function remove(id) {
    const [result] = await pool_1.pool.execute('DELETE FROM reportes WHERE id = ?', [id]);
    return result.affectedRows > 0;
}
async function findByDateRange(startDate, endDate) {
    const [rows] = await pool_1.pool.execute(`SELECT 
            r.id, 
            r.cliente_id as clienteId, 
            DATE_FORMAT(r.fecha_servicio, '%Y-%m-%d') as fechaServicio, 
            r.hora_servicio as horaServicio,
            r.formula,
            r.observaciones,
            r.precio,
            r.created_at as createdAt,
            r.updated_at as updatedAt,
            c.nombre as clienteNombre,
            c.email as clienteEmail,
            col.nombre as coloracion,
            col.descripcion as coloracion_desc
        FROM reportes r
        LEFT JOIN clientes c ON r.cliente_id = c.id
        LEFT JOIN coloraciones col ON r.coloracion_id = col.id
        WHERE r.fecha_servicio BETWEEN ? AND ?
        ORDER BY r.fecha_servicio DESC, r.hora_servicio DESC`, [startDate, endDate]);
    return rows;
}
