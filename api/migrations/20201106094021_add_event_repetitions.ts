import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("events", function (table) {
    table.string("repeat");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("events", function (table) {
    table.dropColumn("repeat");
  });
}
