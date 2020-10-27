exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("email");
    })
    .createTable("pods", (table) => {
      table.increments("id").primary();
      table.string("name");
      //table.integer("ownerId").unsigned().references("id").inTable("users");
    })
    .createTable("events", (table) => {
      table.increments("id").primary();
      table.integer("ownerId").unsigned().references("id").inTable("users");
      table.string("address");
      table.datetime("start_time");
      table.datetime("end_time");
      table.string("notes");
    })
    .table("users", (table) => {
      table.integer("podId").unsigned().references("id").inTable("pods");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users").dropTable("pods").dropTable("pods");
};
