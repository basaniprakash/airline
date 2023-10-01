require('dotenv').config();

module.exports = {
    development: {
        username: 'bs',
        password: process.env.DB_PASSWORD,
        database: 'database_development',
        host: '192.168.122.10',
        dialect: 'mysql'
    },
    test: {
        username: "bs",
        password: process.env.DB_PASSWORD,
        database: "database_test",
        host: "192.168.122.10",
        dialect: "mysql"
    },
    production: {
        username: "bs",
        password: process.env.DB_PASSWORD,
        database: "database_production",
        host: "192.168.122.10",
        dialect: "mysql"
      }
};