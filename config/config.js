require('dotenv').config();

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: './.env.test' });
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
    "username": process.env.DB_USERNAMEZ,
    "password": process.env.DB_PASSWORDZ,
    "database": process.env.DB_NAMEZ,
    "host": process.env.HOSTZ,
    "dialect": process.env.DB_DIALECTZ
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
