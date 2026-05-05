"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.findByEmail = findByEmail;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.search = search;
exports.searchPagination = searchPagination;
const pool_1 = require("../db/pool");
async function findAll() {
    const [rows] = await pool_1.pool.execute('SELECT id, nombre, email, telefono, comentarios, created_at as createdAt, updated_at as updatedAt FROM clientes ORDER BY created_at DESC');
    return rows;
}
async function findById(id) {
    const [rows] = await pool_1.pool.execute('SELECT id, nombre, email, telefono, comentarios, created_at as createdAt, updated_at as updatedAt FROM clientes WHERE id = ?', [id]);
    return rows[0] ?? null;
}
async function findByEmail(email) {
    const [rows] = await pool_1.pool.execute('SELECT id, nombre, email, telefono, comentarios, created_at as createdAt, updated_at as updatedAt FROM clientes WHERE email = ?', [email]);
    return rows[0] ?? null;
}
async function create(nombre, email, telefono, comentarios) {
    const [result] = await pool_1.pool.execute('INSERT INTO clientes (nombre, email, telefono, comentarios) VALUES (?, ?, ?, ?)', [nombre, email, telefono, comentarios]);
    const cliente = await findById(result.insertId);
    if (!cliente)
        throw new Error('Failed to create cliente');
    return cliente;
}
async function update(id, nombre, email, telefono, comentarios) {
    const [result] = await pool_1.pool.execute('UPDATE clientes SET nombre = ?, email = ?, telefono = ?, comentarios = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [nombre, email, telefono, comentarios, id]);
    if (result.affectedRows === 0)
        return null;
    return await findById(id);
}
async function remove(id) {
    const [result] = await pool_1.pool.execute('DELETE FROM clientes WHERE id = ?', [id]);
    return result.affectedRows > 0;
}
async function search(query) {
    const searchPattern = `%${query}%`;
    const [rows] = await pool_1.pool.execute('SELECT id, nombre, email, telefono, comentarios, created_at as createdAt, updated_at as updatedAt FROM clientes WHERE nombre LIKE ? OR email LIKE ? OR telefono LIKE ? OR comentarios LIKE ? ORDER BY nombre', [searchPattern, searchPattern, searchPattern, searchPattern]);
    return rows;
}
async function searchPagination(page, size, clientName, clientEmail, clientPhone, sortField, sortOrder) {
    const safePage = Math.max(1, page | 0);
    const safeSize = Math.max(1, size | 0);
    const offset = (safePage - 1) * safeSize;
    const clauses = [];
    const params = [];
    const name = clientName?.trim();
    const email = clientEmail?.trim();
    const phone = clientPhone?.trim();
    if (name) {
        clauses.push('nombre LIKE ?');
        params.push(`%${name}%`);
    }
    if (email) {
        clauses.push('email LIKE ?');
        params.push(`%${email}%`);
    }
    if (phone) {
        clauses.push('telefono LIKE ?');
        params.push(`%${phone}%`);
    }
    let baseQuery = 'SELECT id, nombre, email, telefono, comentarios, created_at AS createdAt, updated_at AS updatedAt FROM clientes';
    let countQuery = 'SELECT COUNT(*) AS total FROM clientes';
    if (clauses.length) {
        const whereClause = ' WHERE ' + clauses.join(' OR ');
        baseQuery += whereClause;
        countQuery += whereClause;
    }
    const allowedSortFields = new Set(['id', 'nombre', 'created_at']);
    const safeSortField = sortField && allowedSortFields.has(sortField) ? sortField : 'id';
    const safeSortOrder = sortOrder?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    const paginatedQuery = `${baseQuery} ORDER BY ${safeSortField} ${safeSortOrder} LIMIT ${safeSize} OFFSET ${offset}`;
    const [rows] = await pool_1.pool.execute(paginatedQuery, params);
    const [countRows] = await pool_1.pool.execute(countQuery, params);
    const total = Number(countRows[0]?.total ?? 0);
    return {
        clientes: rows,
        total,
    };
}
