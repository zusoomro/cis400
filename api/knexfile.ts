// Update with your config settings.

var pg = require("pg");
pg.defaults.ssl = { rejectUnauthorized: false };

const config = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./mydb.sqlite",
    },
    useNullasDefault: true,
  },

  testing: {
    client: "sqlite3",
    connection: {
      filename: "./testdb.sqlite",
    },
    useNullasDefault: true,
  },

  production: {
    client: "postgres",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
