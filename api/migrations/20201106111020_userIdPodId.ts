import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("usersPods", (table) => {
    table.increments("id").primary();
    table.integer("userId").unsigned().references("id").inTable("users");
    table.integer("podId").unsigned().references("id").inTable("pods");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("usersPods");
}
