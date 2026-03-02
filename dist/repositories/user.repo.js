"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByEmail = findByEmail;
exports.findById = findById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.updatePassword = updatePassword;
exports.signInUser = signInUser;
exports.findAll = findAll;
exports.searchPagination = searchPagination;
const password_1 = require("../utils/password");
const pool_1 = require("../db/pool");
const logger_1 = require("../config/logger");
async function findByEmail(email) {
    const [result] = await pool_1.pool.execute('SELECT id, email, password_hash as passwordHash, name, role_id as role, created_at as createdAt, updated_at as updatedAt FROM users WHERE email = ?', [email]);
    logger_1.logger.info('result: ' + result);
    return result[0] ?? null;
}
async function findById(id) {
    const [result] = await pool_1.pool.execute('SELECT id, email, password_hash as passwordHash, name, role_id as role, created_at as createdAt, updated_at as updatedAt FROM users WHERE id = ?', [id]);
    return result[0] ?? null;
}
async function createUser(email, passwordHash, name, role) {
    const [result] = await pool_1.pool.execute('INSERT INTO users (email, password_hash, name, role_id) VALUES (?, ?, ?, ?)', [email, passwordHash, name, role]);
    return { id: result.insertId, email, passwordHash, name, role, createdAt: new Date(), updatedAt: new Date() };
}
async function updateUser(id, email, name, updatedAt) {
    try {
        const [result] = await pool_1.pool.execute('UPDATE users SET email = ?, name = ?, updated_at = ? WHERE id = ?', [email, name, updatedAt, id]);
        if (result.affectedRows === 0)
            return null;
        // Return the updated user by fetching it
        return await findById(id);
    }
    catch (error) {
        return null;
    }
}
async function updatePassword(passwordHash, id) {
    try {
        const [result] = await pool_1.pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
        if (result.affectedRows === 0)
            return null;
        return await findById(id);
    }
    catch (error) {
        return null;
    }
}
async function signInUser(email, passwordHash) {
    const user = await findByEmail(email);
    if (!user)
        return null;
    const isPasswordValid = await (0, password_1.compare)(passwordHash, user.passwordHash);
    if (!isPasswordValid)
        return null;
    return { ...user, passwordHash: '' };
}
async function findAll() {
    const [result] = await pool_1.pool.execute('SELECT id, email, password_hash as passwordHash, name, role_id as role, created_at as createdAt, updated_at as updatedAt FROM users');
    return result;
}
async function searchPagination(page, size, email, name, role, sortField, sortOrder) {
    const safePage = Math.max(1, page | 0);
    const safeSize = Math.max(1, size | 0);
    const offset = (safePage - 1) * safeSize;
    const clauses = [];
    const params = [];
    if (email) {
        clauses.push('email LIKE ?');
        params.push(`%${email}%`);
    }
    if (name) {
        clauses.push('name LIKE ?');
        params.push(`%${name}%`);
    }
    if (role && role != -1) {
        clauses.push('role_id = ?');
        params.push(role);
    }
    let query = 'select id, email, name, role_id as role, created_at as createdAt, updated_at as updatedAt from users';
    if (clauses.length) {
        query += ' where ' + clauses.join(' and ');
    }
    if (sortField && sortOrder) {
        query += ` ORDER BY ${sortField} ${sortOrder}`;
    }
    else {
        query += ` ORDER BY id`;
    }
    query += ` LIMIT ${safeSize} OFFSET ${offset}`;
    const [rows] = await pool_1.pool.execute(query, params);
    return rows;
}
