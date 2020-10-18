// Update with your config settings.

var pg = require("pg");
pg.defaults.ssl = { rejectUnauthorized: false };

module.exports = {
  development: {
    client: "postgres",
    connection: {
      host: "ec2-34-192-30-15.compute-1.amazonaws.com",
      user: "mxbwhnsucmldfg",
      database: "d5p41hhsnkoo9q",
      password:
        "ad862a41532d1253d18acb1d6e21481642572850120b503a2e277d94aab9ca57",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
