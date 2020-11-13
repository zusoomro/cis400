import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("users", (table) => {
    table.dropColumn("podId");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("users", (table) => {
    table.integer("podId").unsigned().references("id").inTable("pods");
  });
}
