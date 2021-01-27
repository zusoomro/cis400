import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("events", (table) => {
    table.string("startFormattedAddress");
    table.float("startLat");
    table.float("starLng");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("users", (table) => {
    table.dropColumn("startFormattedAddress");
    table.dropColumn("startLat");
    table.dropColumn("starLng");
  });
}
