const mysql = require('mysql2/promise');

let pool;

const connectMySQL = async () => {
    try {
        pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            reconnect: true,
            acquireTimeout: 60000,
            timeout: 60000
        });

        // Test the connection
        const connection = await pool.getConnection();
        console.log('✅ MySQL Connected successfully');
        connection.release();

        // Create tables if they don't exist
        await createTables();

    } catch (error) {
        console.error('❌ MySQL connection error:', error.message);
        process.exit(1);
    }
};

const createTables = async () => {
    try {
        // Users table (for authentication)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'doctor', 'staff') NOT NULL DEFAULT 'staff',
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Doctors table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS doctors (
                id INT PRIMARY KEY AUTO_INCREMENT,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                specialization VARCHAR(100) NOT NULL,
                qualification VARCHAR(200),
                experience_years INT DEFAULT 0,
                phone VARCHAR(20),
                email VARCHAR(255),
                consultation_fee DECIMAL(10,2) DEFAULT 0.00,
                available_days JSON,
                available_hours JSON,
                bio TEXT,
                image_url VARCHAR(500),
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Services table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS services (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                duration_minutes INT DEFAULT 30,
                price DECIMAL(10,2) DEFAULT 0.00,
                category VARCHAR(100),
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ MySQL tables created/verified successfully');
    } catch (error) {
        console.error('❌ Error creating MySQL tables:', error.message);
    }
};

const getPool = () => {
    if (!pool) {
        throw new Error('MySQL pool not initialized. Call connectMySQL first.');
    }
    return pool;
};

module.exports = { connectMySQL, getPool };
