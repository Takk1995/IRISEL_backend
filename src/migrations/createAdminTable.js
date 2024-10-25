const pool = require('../config/db');

const createAdminTable = async() => {
    const productsDataBaseUrl = `
        CREATE TABLE IF NOT EXISTS adminproducts(
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            class VARCHAR(50) NOT NULL,
            number VARCHAR(50) NOT NULL,
            image VARCHAR(255),
            description TEXT,
            price INT NOT NULL,
            capacity VARCHAR(50),
            quantity INT NOT NULL DEFAULT 0
        );
    `
    const adminDataUrl = `
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `
    
    const insertProductData = `
        INSERT INTO adminproducts (
            id,
            name,
            class,
            number,
            image,
            description,
            price,
            capacity,
            quantity
        ) VALUES 
        ('1', 'product1', 'class1', '1011000', 'Null', '123', '5800', '100', '50'),
        ('2', 'product2', 'class2', '1021000', 'Null', '124', '5900', '100', '30'),
        ('3', 'product3', 'class3', '1031000', 'Null', '125', '6000', '100', '20');
    `

    const insertAdminData = `
        INSERT INTO admins (username, password)
        VALUES ('test123', '1234')
    `
}