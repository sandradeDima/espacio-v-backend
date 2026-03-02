"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
const pool_1 = require("../pool");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = require("../../config/logger");
async function seedAdmin() {
    try {
        // Hash the admin password
        const hashedPassword = await bcryptjs_1.default.hash('Admin123!', 10);
        // Insert default roles
        await pool_1.pool.query("INSERT IGNORE INTO roles (name) VALUES ('admin')");
        await pool_1.pool.query("INSERT IGNORE INTO roles (name) VALUES ('user')");
        // Insert admin user
        await pool_1.pool.query(`
      INSERT IGNORE INTO users (email, password_hash, name, role_id) 
      VALUES (?, ?, ?, 1)
    `, ['admin@admin.com', hashedPassword, 'Admin User']);
        logger_1.logger.info('✅ Admin user seeded successfully');
        logger_1.logger.info('📧 Email: admin@admin.com');
        logger_1.logger.info('🔑 Password: Admin123!');
    }
    catch (error) {
        logger_1.logger.error(`❌ Failed to seed admin user: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
}
