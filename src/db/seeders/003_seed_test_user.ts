import { pool } from '../pool';
import bcrypt from 'bcryptjs';
import { logger } from '../../config/logger';

export async function seedTestUser() {
  try {
    // Hash the test user password
    const hashedPassword = await bcrypt.hash('user_password', 10);

    const [roles] = await pool.query(
      "SELECT id, name FROM roles WHERE name IN ('admin', 'user')"
    );
    const userRole = (roles as Array<{ id: number; name: string }>).find(
      (role) => role.name === 'user'
    );

    if (!userRole) {
      throw new Error('User role not found');
    }

    // Insert or refresh test user using the role id of the user role in this environment
    await pool.query(
      `
      INSERT INTO users (email, password_hash, name, role_id) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        password_hash = VALUES(password_hash),
        name = VALUES(name),
        role_id = VALUES(role_id)
    `,
      ['user@test.com', hashedPassword, 'Test User', userRole.id]
    );
    
    logger.info('✅ Test user seeded successfully');
    logger.info('📧 Email: user@test.com');
    logger.info('🔑 Password: user_password');
    logger.info(`👤 Role: user (${userRole.id})`);
  } catch (error) {
    logger.error(`❌ Failed to seed test user: ${error instanceof Error ? error.message : String(error as Error)}`);
    throw error;
  }
}
