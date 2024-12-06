require('dotenv').config();

if (process.env.NODE_ENV === 'test') {
  console.log('Loading .env.test from:', require('path').resolve(__dirname, '../.env.test'));
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.test') });
}

const config = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.HOST,
    "dialect": process.env.DB_DIALECT
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.HOST,
    "dialect": process.env.DB_DIALECT
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
};

module.exports = config;
