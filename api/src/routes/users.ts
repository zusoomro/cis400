import express from "express";
import User from "../../models/User";

let usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  const response = await User.query();
  res.json(response);
});

usersRouter.post("/", async (req, res) => {
  const response = await User.query().insert({
    email: "zusoomro@seas.upenn.edu",
  });
  res.json(response);
});

export default usersRouter;
