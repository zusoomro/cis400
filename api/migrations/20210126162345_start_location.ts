import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("events", (table) => {
    table.renameColumn("formattedAddress", "endFormattedAddress");
    table.renameColumn("lat", "endLat");
    table.renameColumn("lng", "endLng");

    table.string("startFormattedAddress");
    table.float("startLat");
    table.float("starLng");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("users", (table) => {
    table.renameColumn("endFormattedAddress", "formattedAddress");
    table.renameColumn("endLat", "lat");
    table.renameColumn("endLng", "lng");

    table.dropColumn("startFormattedAddress");
    table.dropColumn("startLat");
    table.dropColumn("starLng");
  });
}
