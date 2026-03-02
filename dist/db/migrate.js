"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const pool_1 = require("./pool");
const logger_1 = require("../config/logger");
class MigrationRunner {
    constructor() {
        this.migrations = [];
        this.loadMigrations();
    }
    loadMigrations() {
        const migrationsDir = (0, path_1.join)(__dirname, 'migrations');
        const files = (0, fs_1.readdirSync)(migrationsDir)
            .filter(f => f.endsWith('.sql'))
            .sort();
        this.migrations = files.map(file => ({
            name: file,
            up: async () => {
                const sql = (0, fs_1.readFileSync)((0, path_1.join)(migrationsDir, file), 'utf8');
                // Split SQL into individual statements and execute them one by one
                const statements = sql
                    .split(';')
                    .map(stmt => stmt.trim())
                    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
                for (const statement of statements) {
                    if (statement.trim()) {
                        await pool_1.pool.query(statement);
                    }
                }
                await this.recordMigration(file);
                logger_1.logger.info(`✅ Applied migration: ${file}`);
            }
        }));
    }
    async recordMigration(name) {
        await pool_1.pool.query("INSERT INTO _migrations(name) VALUES (?) ON DUPLICATE KEY UPDATE name = name", [name]);
    }
    async getExecutedMigrations() {
        const [rows] = await pool_1.pool.query("SELECT name FROM _migrations");
        return rows.map(row => row.name);
    }
    async up() {
        logger_1.logger.info('🚀 Starting migrations...');
        // Ensure migrations table exists
        await pool_1.pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        name VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        const executed = await this.getExecutedMigrations();
        const pending = this.migrations.filter(m => !executed.includes(m.name));
        if (pending.length === 0) {
            logger_1.logger.info('✅ No pending migrations');
            return;
        }
        logger_1.logger.info(`📋 Found ${pending.length} pending migrations`);
        for (const migration of pending) {
            try {
                await migration.up();
            }
            catch (error) {
                logger_1.logger.error(`❌ Failed to apply migration ${migration.name}: ${error instanceof Error ? error.message : String(error)}`);
                throw error;
            }
        }
        logger_1.logger.info('🎉 All migrations completed successfully!');
    }
    async status() {
        await pool_1.pool.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        name VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        const executed = await this.getExecutedMigrations();
        logger_1.logger.info('📊 Migration Status:');
        logger_1.logger.info(`Total migrations: ${this.migrations.length}`);
        logger_1.logger.info(`Executed: ${executed.length}`);
        logger_1.logger.info(`Pending: ${this.migrations.length - executed.length}`);
        if (executed.length > 0) {
            logger_1.logger.info('\n✅ Executed migrations:');
            executed.forEach(name => logger_1.logger.info(`  - ${name}`));
        }
        const pending = this.migrations.filter(m => !executed.includes(m.name));
        if (pending.length > 0) {
            logger_1.logger.info('\n⏳ Pending migrations:');
            pending.forEach(m => logger_1.logger.info(`  - ${m.name}`));
        }
    }
}
// CLI Interface
const command = process.argv[2] || 'up';
(async () => {
    try {
        const runner = new MigrationRunner();
        switch (command) {
            case 'up':
                await runner.up();
                break;
            case 'status':
                await runner.status();
                break;
            default:
                logger_1.logger.error(`Unknown command: ${command}`);
                logger_1.logger.info('Available commands: up, status');
                process.exit(1);
        }
    }
    catch (error) {
        logger_1.logger.error(`Migration failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
    finally {
        await pool_1.pool.end();
    }
})();
