import { app } from "../index";
import request from "supertest";
import Knex from "knex";
import initializeDb from "../initializeDb";
import Event from "../../models/Event";

let knex: Knex;

beforeEach(async () => {
  knex = initializeDb();
  await knex.migrate.latest();
  await knex.seed.run();
});

const events = [
  {
    id: 1,
    ownerId: 1,
    formattedAddress: "3934 Pine St, Philadelphia, PA 19104, USA",
    start_time: "2020-11-13T03:10:33.447Z",
    end_time: "2020-11-13T04:10:33.447Z",
    notes: "Bike ride time.",
    name: "Go for a bike ride",
    lat: 39.95034599999999,
    lng: -75.201981,
    repeat: "weekly",
  },
  {
    id: 2,
    ownerId: 3,
    formattedAddress: "1204 Walnut St, Philadelphia, PA 19107, USA",
    start_time: "2020-11-13T04:20:08.731Z",
    end_time: "2020-11-13T05:20:08.731Z",
    notes: "Nail time.",
    name: "Get nails done",
    lat: 39.94884270000001,
    lng: -75.1608773,
    repeat: "no_repeat",
  },
];

describe("the events api", () => {
  describe("update event route", () => {
    it("requires auth", async () => {
      await request(app).put("/events").send({}).expect(401);
    });
  });

  describe("create event route", () => {
    it("requires auth", async () => {
      await request(app).post("/events").send({}).expect(401);
    });
  });

  describe("get event route", () => {
    it("requires auth", async () => {
      await request(app).get("/events").send({}).expect(401);
    });
  });
});
