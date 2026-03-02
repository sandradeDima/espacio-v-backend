"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.withTx = withTx;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = require("../config/env");
exports.pool = promise_1.default.createPool({
    host: env_1.env.db.host,
    port: env_1.env.db.port,
    user: env_1.env.db.user,
    password: env_1.env.db.password,
    database: env_1.env.db.database,
    connectionLimit: 10,
    namedPlaceholders: true
});
async function withTx(fn) {
    const conn = await exports.pool.getConnection();
    try {
        await conn.beginTransaction();
        const result = await fn(conn);
        await conn.commit();
        return result;
    }
    catch (error) {
        await conn.rollback();
        throw error;
    }
    finally {
        conn.release();
    }
}
