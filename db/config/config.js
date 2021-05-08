require('dotenv').config();
const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

// Set the Postgres config options 
module.exports= {
  "development": {
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: "lift_db",
      host: DB_HOST,
      dialect: "postgres",

  },
  "test": {
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: "lift_db",
      host: DB_HOST,
      dialect: "postgres",
  },
  "production": {
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: "lift_db",
      host: DB_HOST,
      dialect: "postgres",
  }
}
