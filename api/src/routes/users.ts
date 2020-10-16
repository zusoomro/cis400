import express from "express";

let usersRouter = express.Router();

usersRouter.get("/", (req, res) => {
  res.json({ msg: "hello" });
});

export default usersRouter;
