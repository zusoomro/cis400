import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("users", function (table) {
    table.boolean("inPod");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("users", function (table) {
    table.dropColumn("inPod");
  });
}
