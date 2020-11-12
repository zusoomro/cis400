import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    { id: 1, email: "zulfi@wigo.com", password: "password" },
    { id: 2, email: "caro@wigo.com", password: "password" },
    { id: 3, email: "chloe@wigo.com", password: "password" },
    { id: 4, email: "ally@wigo.com", password: "password" },
  ]);
}
