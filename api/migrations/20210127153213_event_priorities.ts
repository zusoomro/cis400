import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("events", function (table) {
    table.integer("priority");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("events", function (table) {
    table.dropColumn("priority");
  });
}
