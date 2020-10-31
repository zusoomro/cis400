import User from "../../models/User";
import { app, server } from "../index";
import request from "supertest";
import Knex from "knex";
import express from "express";
import initializeDb from "../initializeDb";

let knex: Knex;

beforeEach(async () => {
  knex = initializeDb();
  await knex.migrate.latest();
});

afterEach((done) => {
  knex.destroy();
  server.close();
  done();
});

describe("the auth api", () => {
  it("can run tests", () => {
    expect(true).toBeTruthy();
  });

  describe("the registration handler", () => {
    it("returns an error when the user already exists", async () => {
      await request(app).get("/users").expect(200);
      expect(true).toBeTruthy();
    });
  });
});
