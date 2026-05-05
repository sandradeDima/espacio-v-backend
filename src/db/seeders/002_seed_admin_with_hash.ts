import { pool } from '../pool';
import bcrypt from 'bcryptjs';
import { logger } from '../../config/logger';

export async function seedAdmin() {
  try {
    // Hash the admin password
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    // Insert default roles
    await pool.query("INSERT IGNORE INTO roles (name) VALUES ('admin')");
    await pool.query("INSERT IGNORE INTO roles (name) VALUES ('user')");

    const [roles] = await pool.query(
      "SELECT id, name FROM roles WHERE name IN ('admin', 'user')"
    );
    const adminRole = (roles as Array<{ id: number; name: string }>).find(
      (role) => role.name === 'admin'
    );

    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    // Insert or refresh admin user using the role id of the admin role in this environment
    await pool.query(
      `
      INSERT INTO users (email, password_hash, name, role_id) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        password_hash = VALUES(password_hash),
        name = VALUES(name),
        role_id = VALUES(role_id)
    `,
      ['admin@admin.com', hashedPassword, 'Admin User', adminRole.id]
    );
    
    logger.info('✅ Admin user seeded successfully');
    logger.info('📧 Email: admin@admin.com');
    logger.info('🔑 Password: Admin123!');
  } catch (error) {
    logger.error(`❌ Failed to seed admin user: ${error instanceof Error ? error.message : String(error as Error)}`);
    throw error;
  }
}
