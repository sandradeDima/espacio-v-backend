"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const pool_1 = require("./pool");
const logger_1 = require("../config/logger");
class SeederRunner {
    constructor() {
        this.seeders = [];
        this.loadSeeders();
    }
    loadSeeders() {
        const seedersDir = (0, path_1.join)(__dirname, 'seeders');
        // Check if seeders directory exists
        try {
            const files = (0, fs_1.readdirSync)(seedersDir)
                .filter(f => f.endsWith('.sql') || f.endsWith('.ts'))
                .sort();
            this.seeders = files.map(file => ({
                name: file,
                run: async () => {
                    if (file.endsWith('.sql')) {
                        const sql = (0, fs_1.readFileSync)((0, path_1.join)(seedersDir, file), 'utf8');
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
                        logger_1.logger.info(`✅ Applied SQL seeder: ${file}`);
                    }
                    else if (file.endsWith('.ts')) {
                        // For TypeScript seeders, we'll need to import them dynamically
                        // This is a simplified approach - in production you might want to use a different strategy
                        logger_1.logger.warn(`TypeScript seeder ${file} detected but not automatically executed.`);
                        logger_1.logger.warn('Please run TypeScript seeders manually or convert them to SQL.');
                    }
                }
            }));
        }
        catch (error) {
            logger_1.logger.warn('No seeders directory found or no seeder files in seeders directory');
            this.seeders = [];
        }
    }
    async run() {
        logger_1.logger.info('🌱 Starting seeders...');
        if (this.seeders.length === 0) {
            logger_1.logger.info('ℹ️  No seeders found');
            return;
        }
        logger_1.logger.info(`📋 Found ${this.seeders.length} seeders`);
        for (const seeder of this.seeders) {
            try {
                await seeder.run();
            }
            catch (error) {
                logger_1.logger.error(`❌ Failed to run seeder ${seeder.name}: ${error instanceof Error ? error.message : String(error)}`);
                throw error;
            }
        }
        logger_1.logger.info('🎉 All seeders completed successfully!');
    }
    async runSpecific(seederName) {
        const seeder = this.seeders.find(s => s.name === seederName);
        if (!seeder) {
            logger_1.logger.error(`❌ Seeder not found: ${seederName}`);
            logger_1.logger.info('Available seeders:');
            this.seeders.forEach(s => logger_1.logger.info(`  - ${s.name}`));
            return;
        }
        logger_1.logger.info(`🌱 Running seeder: ${seederName}`);
        try {
            await seeder.run();
            logger_1.logger.info('✅ Seeder completed successfully!');
        }
        catch (error) {
            logger_1.logger.error(`❌ Failed to run seeder ${seederName}: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
    list() {
        logger_1.logger.info('📋 Available seeders:');
        if (this.seeders.length === 0) {
            logger_1.logger.info('  No seeders found');
        }
        else {
            this.seeders.forEach(seeder => logger_1.logger.info(`  - ${seeder.name}`));
        }
    }
}
// CLI Interface
const command = process.argv[2] || 'run';
const seederName = process.argv[3];
(async () => {
    try {
        const runner = new SeederRunner();
        switch (command) {
            case 'run':
                if (seederName) {
                    await runner.runSpecific(seederName);
                }
                else {
                    await runner.run();
                }
                break;
            case 'list':
                runner.list();
                break;
            default:
                logger_1.logger.error(`Unknown command: ${command}`);
                logger_1.logger.info('Available commands: run, run <seeder-name>, list');
                process.exit(1);
        }
    }
    catch (error) {
        logger_1.logger.error(`Seeding failed: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
    finally {
        await pool_1.pool.end();
    }
})();
