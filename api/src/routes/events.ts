import express from "express";
import Event from "../../models/Event";

let eventRouter = express.Router();

eventRouter.get("/", async (req, res) => {
  const response = await Event.query();
  console.log(response);
  res.json(response);
});

eventRouter.post("/", async (req, res) => {
  console.log("Calling eventRouter.post");
  const { name, ownerId, address, startTime, endTime, notes } = req.body;

  const event = await Event.query().insert({
    ownerId: ownerId,
    name: name,
    address: address,
    start_time: startTime,
    end_time: endTime,
    notes: notes,
  });

  console.log(`Creating event with name '${event.name}' and id '${event.id}'`);
});

export default eventRouter;
