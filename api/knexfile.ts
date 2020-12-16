// Update with your config settings.

var pg = require("pg");
pg.defaults.ssl = { rejectUnauthorized: false };

const config = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./mydb.sqlite",
    },
    useNullAsDefault: true,
  },

  testing: {
    client: "sqlite3",
    connection: ":memory:",
    useNullAsDefault: true,
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
