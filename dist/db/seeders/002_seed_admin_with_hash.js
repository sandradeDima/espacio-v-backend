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
        const [roles] = await pool_1.pool.query("SELECT id, name FROM roles WHERE name IN ('admin', 'user')");
        const adminRole = roles.find((role) => role.name === 'admin');
        if (!adminRole) {
            throw new Error('Admin role not found');
        }
        // Insert or refresh admin user using the role id of the admin role in this environment
        await pool_1.pool.query(`
      INSERT INTO users (email, password_hash, name, role_id) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        password_hash = VALUES(password_hash),
        name = VALUES(name),
        role_id = VALUES(role_id)
    `, ['admin@admin.com', hashedPassword, 'Admin User', adminRole.id]);
        logger_1.logger.info('✅ Admin user seeded successfully');
        logger_1.logger.info('📧 Email: admin@admin.com');
        logger_1.logger.info('🔑 Password: Admin123!');
    }
    catch (error) {
        logger_1.logger.error(`❌ Failed to seed admin user: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
}
