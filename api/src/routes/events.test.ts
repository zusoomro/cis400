import { app } from "../index";
import request from "supertest";
import Knex from "knex";
import initializeDb from "../initializeDb";

let knex: Knex;

beforeEach(async () => {
  knex = initializeDb();
  await knex.migrate.latest();
  await knex.seed.run();
});

afterEach(async (done) => {
  await knex.destroy();
  done();
});

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
