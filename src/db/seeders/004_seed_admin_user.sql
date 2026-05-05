-- Ensure default roles exist
INSERT IGNORE INTO roles (name) VALUES ('admin');
INSERT IGNORE INTO roles (name) VALUES ('user');

-- Ensure the default admin user exists with a valid password hash
-- Email: admin@admin.com
-- Password: Admin123!
INSERT INTO users (email, password_hash, name, role_id)
SELECT 'admin@admin.com', '$2b$10$giwylHiEw1suqtZIlFDJ5ecUR6vJKGdhwTqiBdLi2y5UnLPddTDca', 'Admin User', id
FROM roles
WHERE name = 'admin'
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  name = VALUES(name),
  role_id = VALUES(role_id);
