import * as Knex from "knex";
import bcrypt from "bcrypt";
import gravatar from "gravatar";

const getAvatar = (email: string) => {
  return gravatar.url(
    email,
    {
      s: "200",
      r: "pg",
      d: "retro",
    },
    false
  );
};

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password", salt);

  // Inserts user entries
  await knex("users").insert([
    {
      id: 1,
      email: "zusoomro@seas.upenn.edu",
      password: hashedPassword,
      avatar: getAvatar("zusoomro@seas.upenn.edu"),
    },
    {
      id: 2,
      email: "caromurp@seas.upenn.edu",
      password: hashedPassword,
      avatar: getAvatar("caromurp@seas.upenn.edu"),
    },
    {
      id: 3,
      email: "pchloe@seas.upenn.edu",
      password: hashedPassword,
      avatar: getAvatar("pchloe@seas.upenn.edu"),
    },
    {
      id: 4,
      email: "name8@seas.upenn.edu",
      password: hashedPassword,
      avatar: getAvatar("name8@seas.upenn.edu"),
    },
  ]);

  // Inserts pod entry
  await knex("pods").insert([
    {
      id: 1,
      name: "The Homies",
      ownerId: 1,
      homeAddress: "4000 Spruce St, Philadelphia, PA 19104, USA",
      lat: 39.951543,
      lng: -75.2032578,
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

  // Inserts events
  await knex("events").insert([
    {
      id: 1,
      ownerId: 1,
      formattedAddress: "3934 Pine St, Philadelphia, PA 19104, USA",
      start_time: "2021-02-13T03:10:33.447Z",
      end_time: "2021-02-13T04:10:33.447Z",
      notes: "Bike ride time.",
      name: "Go for a bike ride",
      lat: 39.95034599999999,
      lng: -75.201981,
      startFormattedAddress:
        "2600 Benjamin Franklin Pkwy, Philadelphia, PA 19130",
      startLat: 39.96559932575133,
      startLng: -75.18103515688867,
      repeat: "weekly",
      priority: 0,
    },
    {
      id: 2,
      ownerId: 3,
      startFormattedAddress: "1204 Walnut St, Philadelphia, PA 19107, USA",
      start_time: "2021-02-13T03:10:33.447Z",
      end_time: "2021-02-13T04:10:33.447Z",
      notes: "Nail time.",
      name: "Get nails done",
      startLat: 39.94884270000001,
      startLng: -75.1608773,
      formattedAddress: "119 S 22nd St, Philadelphia, PA 19103",
      lat: 39.952501127246514,
      lng: -75.17685303028932,
      repeat: "no_repeat",
      priority: 0,
    },
    {
      id: 3,
      ownerId: 4,
      formattedAddress: "4000 Spruce St, Philadelphia, PA 19104, USA",
      start_time: "2021-02-13T03:10:33.447Z",
      end_time: "2021-02-13T04:10:33.447Z",
      notes: "Sk8r girl time",
      name: "Skateboard",
      lat: 39.951543,
      lng: -75.2032578,
      startFormattedAddress: "3000 Walnut St, Philadelphia, PA 19104",
      startLat: 39.9501080396758,
      startLng: -75.18643932821958,
      repeat: "no_repeat",
      priority: 0,
    },
    {
      id: 4,
      ownerId: 2,
      formattedAddress: "1209 Vine St, Philadelphia, PA 19107, USA",
      start_time: "2021-02-13T03:10:33.447Z",
      end_time: "2021-02-13T04:10:33.447Z",
      notes: "DJ TIme.",
      name: "DJ a sick party",
      lat: 39.9577557,
      lng: -75.1590322,
      startFormattedAddress: "4028 Walnut St Philadelphia, PA 19104",
      startLat: 39.954165619431485,
      startLng: -75.20414277491575,
      repeat: "daily",
      priority: 0,
    },
  ]);
}
