"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = require("./pool");
const logger_1 = require("../config/logger");
// Import TypeScript seeders
const _002_seed_admin_with_hash_1 = require("./seeders/002_seed_admin_with_hash");
const _003_seed_test_user_1 = require("./seeders/003_seed_test_user");
const seeders = {
    '002_seed_admin_with_hash': _002_seed_admin_with_hash_1.seedAdmin,
    '003_seed_test_user': _003_seed_test_user_1.seedTestUser
};
const seederName = process.argv[2];
(async () => {
    try {
        if (!seederName) {
            logger_1.logger.error('❌ Please provide a seeder name');
            logger_1.logger.info('Available TypeScript seeders:');
            Object.keys(seeders).forEach(name => logger_1.logger.info(`  - ${name}`));
            process.exit(1);
        }
        const seeder = seeders[seederName];
        if (!seeder) {
            logger_1.logger.error(`❌ Seeder not found: ${seederName}`);
            logger_1.logger.info('Available TypeScript seeders:');
            Object.keys(seeders).forEach(name => logger_1.logger.info(`  - ${name}`));
            process.exit(1);
        }
        logger_1.logger.info(`🌱 Running TypeScript seeder: ${seederName}`);
        await seeder();
        logger_1.logger.info('✅ TypeScript seeder completed successfully!');
    }
    catch (error) {
        logger_1.logger.error(`❌ TypeScript seeder failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
    finally {
        await pool_1.pool.end();
    }
})();
