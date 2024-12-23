require('dotenv').config();

if (process.env.NODE_ENV === 'test') {
  console.log('Loading .env.test from:', require('path').resolve(__dirname, '../.env.test'));
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.test') });
}

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.HOST,
    dialect: process.env.DB_DIALECT
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.HOST,
    dialect: process.env.DB_DIALECT
  },
  production: {
    use_env_variable: 'DATABASE_PUBLIC_URL',
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }

};