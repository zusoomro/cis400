import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("events", function (table) {
        table.renameColumn("address", "formattedAddress");
        table.float("lat");
        table.float("lng");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.table("events", function (table) {
        table.renameColumn("formattedAddress", "address");
        table.dropColumn("lat");
        table.dropColumn("lng");
    });
}

