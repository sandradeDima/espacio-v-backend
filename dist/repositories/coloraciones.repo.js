"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.search = search;
const pool_1 = require("../db/pool");
async function findAll() {
    const [rows] = await pool_1.pool.execute('SELECT id, nombre, descripcion, created_at as createdAt, updated_at as updatedAt FROM coloraciones ORDER BY nombre');
    return rows;
}
async function findById(id) {
    const [rows] = await pool_1.pool.execute('SELECT id, nombre, descripcion, created_at as createdAt, updated_at as updatedAt FROM coloraciones WHERE id = ?', [id]);
    return rows[0] ?? null;
}
async function create(nombre, descripcion) {
    const [result] = await pool_1.pool.execute('INSERT INTO coloraciones (nombre, descripcion) VALUES (?, ?)', [nombre, descripcion]);
    const coloracion = await findById(result.insertId);
    if (!coloracion)
        throw new Error('Failed to create coloracion');
    return coloracion;
}
async function update(id, nombre, descripcion) {
    const [result] = await pool_1.pool.execute('UPDATE coloraciones SET nombre = ?, descripcion = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [nombre, descripcion, id]);
    if (result.affectedRows === 0)
        return null;
    return await findById(id);
}
async function remove(id) {
    const [result] = await pool_1.pool.execute('DELETE FROM coloraciones WHERE id = ?', [id]);
    return result.affectedRows > 0;
}
async function search(query) {
    const searchPattern = `%${query}%`;
    const [rows] = await pool_1.pool.execute('SELECT id, nombre, descripcion, created_at as createdAt, updated_at as updatedAt FROM coloraciones WHERE nombre LIKE ? OR descripcion LIKE ? ORDER BY nombre', [searchPattern, searchPattern]);
    return rows;
}
