const pool = require('../config/db');

const createOrderTable = async() => {
    const orderDataBaseUrl = `
        CREATE TABLE IF NOT EXISTS orders(
            order_number INT AUTO_INCREMENT PRIMARY KEY,
            gw_number VARCHAR(50),
            member_id INT,
            guest_id VARCHAR(50),
            products JSON NOT NULL,
            package ENUM('1', '2') NOT NULL,
            total DECIMAL(10, 2) NOT NULL,
            shipping_address JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `
    const membersDataUrl = `
        CREATE TABLE IF NOT EXISTS members (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `

    const guestsDataUrl = `
        CREATE TABLE IF NOT EXISTS guests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            guest_id VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `
}