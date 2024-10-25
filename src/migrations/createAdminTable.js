const pool = require('../config/db');

const createAdminTable = async() => {
    const adminDataUrl = `
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `
    
    const insertAdminData = `
        INSERT INTO admins (username, password)
        VALUES ('test123', '1234')
    `
}