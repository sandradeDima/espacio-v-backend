"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = sha256;
exports.storeRefreshToken = storeRefreshToken;
exports.consumeRefreshToken = consumeRefreshToken;
exports.revokeAllRefreshTokens = revokeAllRefreshTokens;
exports.revokeRefreshToken = revokeRefreshToken;
const pool_1 = require("../db/pool");
const crypto_1 = __importDefault(require("crypto"));
function sha256(s) {
    return crypto_1.default.createHash('sha256').update(s).digest('hex');
}
async function storeRefreshToken(userId, token, expiresAt) {
    const tokenHash = sha256(token);
    await pool_1.pool.execute('INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)', [userId, tokenHash, expiresAt]);
}
async function consumeRefreshToken(userId, token) {
    try {
        const tokenHash = sha256(token);
        const [rows] = await pool_1.pool.execute('SELECT * FROM refresh_tokens WHERE user_id = ? AND token_hash = ?', [userId, tokenHash]);
        const row = rows[0];
        if (!row)
            throw new Error('Refresh token not found');
        if (row.expires_at < new Date())
            throw new Error('Refresh token expired');
        await pool_1.pool.execute('DELETE FROM refresh_tokens WHERE id = ?', [row.id]);
        return { id: row.id, userId: row.user_id, tokenHash: row.token_hash, expiresAt: row.expires_at, createdAt: row.created_at };
    }
    catch (error) {
        return null;
    }
}
async function revokeAllRefreshTokens(userId) {
    await pool_1.pool.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
}
async function revokeRefreshToken(userId, token) {
    try {
        const tokenHash = sha256(token);
        const [result] = await pool_1.pool.execute('DELETE FROM refresh_tokens WHERE user_id = ? AND token_hash = ?', [userId, tokenHash]);
        return result.affectedRows > 0;
    }
    catch (error) {
        return false;
    }
}
