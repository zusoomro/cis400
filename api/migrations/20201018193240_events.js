exports.up = function (knex) {
  return knex.schema.createTable("events", (table) => {
    table.integer("owner");
    table.increments("id");
    table.string("address");
    table.datetime("start_time");
    table.datetime("end_time");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("events");
};
