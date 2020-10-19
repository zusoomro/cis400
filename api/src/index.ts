import express from "express";
import usersRouter from "./routes/users";
import initializeDb from "./initializeDb";

initializeDb();
const app = express();

app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8000);
