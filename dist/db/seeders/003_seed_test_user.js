"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTestUser = seedTestUser;
const pool_1 = require("../pool");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = require("../../config/logger");
async function seedTestUser() {
    try {
        // Hash the test user password
        const hashedPassword = await bcryptjs_1.default.hash('user_password', 10);
        const [roles] = await pool_1.pool.query("SELECT id, name FROM roles WHERE name IN ('admin', 'user')");
        const userRole = roles.find((role) => role.name === 'user');
        if (!userRole) {
            throw new Error('User role not found');
        }
        // Insert or refresh test user using the role id of the user role in this environment
        await pool_1.pool.query(`
      INSERT INTO users (email, password_hash, name, role_id) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        password_hash = VALUES(password_hash),
        name = VALUES(name),
        role_id = VALUES(role_id)
    `, ['user@test.com', hashedPassword, 'Test User', userRole.id]);
        logger_1.logger.info('✅ Test user seeded successfully');
        logger_1.logger.info('📧 Email: user@test.com');
        logger_1.logger.info('🔑 Password: user_password');
        logger_1.logger.info(`👤 Role: user (${userRole.id})`);
    }
    catch (error) {
        logger_1.logger.error(`❌ Failed to seed test user: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
}
