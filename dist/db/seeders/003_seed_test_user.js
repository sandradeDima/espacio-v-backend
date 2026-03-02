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
        // Insert test user with role 2 (user)
        await pool_1.pool.query(`
      INSERT IGNORE INTO users (email, password_hash, name, role_id) 
      VALUES (?, ?, ?, ?)
    `, ['user@test.com', hashedPassword, 'Test User', 2]);
        logger_1.logger.info('✅ Test user seeded successfully');
        logger_1.logger.info('📧 Email: user@test.com');
        logger_1.logger.info('🔑 Password: user_password');
        logger_1.logger.info('👤 Role: user (2)');
    }
    catch (error) {
        logger_1.logger.error(`❌ Failed to seed test user: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
}
