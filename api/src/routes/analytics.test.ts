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
    let token: string;
    beforeEach(async () => {
      const loginRes = await request(app)
        .post("/users/login")
        .send({
          email: "zusoomro@seas.upenn.edu",
          password: "password",
        })
        .expect(200);

      token = loginRes.body.token;
    });

    it("requires auth", async () => {
      await request(app).get("/analytics/pods/0").expect(401);
    });

    it("returns a bad request when the pod does not exist", async () => {
      await request(app)
        .get("/analytics/pods/9")
        .set("x-auth-token", token)
        .expect(400);
    });

    it("returns the corrent information where there are multiple events and users", async () => {
      await request(app)
        .get("/analytics/pods/1")
        .set("x-auth-token", token)
        .expect(200);
    });
  });

  describe("the breakdown route", () => {
    let token: string;
    beforeEach(async () => {
      const loginRes = await request(app)
        .post("/users/login")
        .send({
          email: "zusoomro@seas.upenn.edu",
          password: "password",
        })
        .expect(200);

      token = loginRes.body.token;
    });

    it("requires auth", async () => {
      await request(app).get("/analytics/breakdown/0").expect(401);
    });

    it("returns a bad request when the pod does not exist", async () => {
      await request(app)
        .get("/analytics/breakdown/9")
        .set("x-auth-token", token)
        .expect(400);
    });

    it("returns the corrent information where there are multiple events and users", async () => {
      const res = await request(app)
        .get("/analytics/breakdown/1?time=month")
        .set("x-auth-token", token)
        .expect(200);

      console.log("res", res.body);
    });
  });
});
