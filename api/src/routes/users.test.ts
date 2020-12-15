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

describe("the users api", () => {
  describe("the get all users route", () => {
    it("gets all users", async () => {
      const res = await request(app).get("/users").expect(200);
      const body = res.body;
      expect(body.length).toBe(4);
    });
  });

  describe("The registration route", () => {
    it("allows a registration", async () => {
      const res = await request(app)
        .post("/users")
        .send({ email: "test@test.com", password: "password" })
        .expect(200);
      const body = res.body;

      expect(body.token).toBeTruthy();
      expect(body.user.email).toBe("test@test.com");
    });

    it("returns an error message when we don't fill out the email", async () => {
      const res = await request(app)
        .post("/users")
        .send({ email: "", password: "password" })
        .expect(400);
      const body = res.body;

      expect(body.message).toBeTruthy();
    });

    it("returns an error message when we don't fill out the password", async () => {
      const res = await request(app)
        .post("/users")
        .send({ email: "test@test.com", password: "" })
        .expect(400);
      const body = res.body;

      expect(body.message).toBeTruthy();
    });

    it("returns an error message when we give a password that is less than 5 characters", async () => {
      const res = await request(app)
        .post("/users")
        .send({ email: "test@test.com", password: "test" })
        .expect(400);
      const body = res.body;

      expect(body.message).toBeTruthy();
    });

    it("returns an error message when we give an invalid email", async () => {
      const res = await request(app)
        .post("/users")
        .send({ email: "test.com", password: "testtest" })
        .expect(400);
      const body = res.body;

      expect(body.message).toBeTruthy();
    });

    it("returns an error when the user already exists", async () => {
      const res = await request(app)
        .post("/users")
        .send({ email: "zusoomro@seas.upenn.edu", password: "password" })
        .expect(400);
      const body = res.body;

      expect(body.message).toBeTruthy();
    });
  });

  describe("The login route", () => {
    it("returns an error when the password is wrong", async () => {
      const res = await request(app)
        .post("/users/login")

        .send({
          email: "zusoomro@seas.upenn.edu",
          password: "passwod",
        })
        .expect(400);

      const body = res.body;

      expect(body.message).toBeTruthy();
    });

    it("returns an error when the user doesn't exist", async () => {
      const res = await request(app)
        .post("/users/login")

        .send({
          email: "doesntexist@test.com",
          password: "password",
        })
        .expect(400);

      const body = res.body;

      expect(body.message).toBeTruthy();
    });

    it("allows us to login after registering", async () => {
      const loginRes = await request(app)
        .post("/users/login")
        .send({
          email: "zusoomro@seas.upenn.edu",
          password: "password",
        })
        .expect(200);

      const loginBody = loginRes.body;

      expect(loginBody.token).toBeTruthy();
    });
  });
});
