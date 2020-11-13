import * as Knex from "knex";
import bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password", salt);

  // Inserts user entries
  await knex("users").insert([
    { id: 1, email: "zulfi@wigo.com", password: hashedPassword },
    { id: 2, email: "caro@wigo.com", password: hashedPassword },
    { id: 3, email: "chloe@wigo.com", password: hashedPassword },
    { id: 4, email: "ally@wigo.com", password: hashedPassword },
  ]);

  // Inserts pod entry
  await knex("pods").insert([
    {
      id: 1,
      name: "The Homies",
      ownerId: 1,
    },
  ]);

  // Inserts pod memberships
  await knex("usersPods").insert([
    {
      id: 1,
      userId: 1,
      podId: 1,
    },
    {
      id: 2,
      userId: 2,
      podId: 1,
    },
    {
      id: 3,
      userId: 3,
      podId: 1,
    },
    {
      id: 4,
      userId: 4,
      podId: 1,
    },
  ]);
}
