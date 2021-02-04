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

describe("the analytics api", () => {
  describe("the pods route", () => {
    beforeEach(async () => {});

    it("requires auth", async () => {
      await request(app).get("/analytics/pods/0").expect(401);
    });

    it("returns a bad request when there is no podId", async () => {
      await request(app).get("/analytics/pods/").expect(400);
    });

    it("returns a bad request when the pod does not exist", async () => {});

    it("returns the correct information when there is one event", async () => {});

    it("returns the corrent information where there are multiple events and users", async () => {});
  });
});
