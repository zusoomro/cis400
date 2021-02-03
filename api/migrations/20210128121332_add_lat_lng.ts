import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("pods", function (table) {
    table.float("lat");
    table.float("lng");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("pods", function (table) {
    table.dropColumn("lat");
    table.dropColumn("lng");
  });
}
