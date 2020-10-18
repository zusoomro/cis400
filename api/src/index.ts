import express from "express";
import usersRouter from "./routes/users";

const app = express();

app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8000);
