import express from "express";
import usersRouter from "./routes/users";
import podsRouter from "./routes/pods";
import eventRouter from "./routes/events";

import initializeDb from "./initializeDb";

initializeDb();
export const app = express();

app.use(express.json());

app.use("/users", usersRouter);

app.use("/pods", podsRouter);

app.use("/events", eventRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

let PORT = 8000;

// Heroku production environment
if (process.env.PORT) {
  PORT = (process.env.PORT as unknown) as number;
}

if (process.env.NODE_ENV != "test") {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
