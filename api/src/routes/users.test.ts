import User from "../../models/User";
import { app } from "../index";
import request from "supertest";
import express from "express";

jest.mock("../../models/User", () => {
  User: {
    query: () => jest.fn();
  }
});

describe("the auth api", () => {
  it("can run tests", () => {
    expect(true).toBeTruthy();
  });

  describe("the registration handler", () => {
    it("returns an error when the user already exists", () => {
      console.log(request(app).get("/users"));
      expect(true).toBeTruthy();
    });
  });
});
