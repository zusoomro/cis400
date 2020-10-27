import express from "express";
import usersRouter from "./routes/users";
import podsRouter from "./routes/pods";
import eventRouter from "./routes/events";

import initializeDb from "./initializeDb";

initializeDb();
const app = express();

app.use(express.json());

app.use("/users", usersRouter);

app.use("/pods", podsRouter);

app.use("/events", eventRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
