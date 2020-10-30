import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("events", function (table) {
    table.string("name");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("events", function (table) {
    table.dropColumn("name");
  });
}
