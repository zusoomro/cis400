import express from "express";
import Event from "../../models/Event";

let eventRouter = express.Router();

eventRouter.post("/", async (req, res) => {
  const { name, address, startTime, endTime, notes } = req.body;

// events doNT HAVE NAMES YET
  const event = await Event.query().insert({
    ownerId: 1,
    address: address,
    startTime: startTime, 
    endTime: endTime,
    notes: notes,
  });

  console.log(`Creating event with name '${name}' and id '${event.id}'`);
});

export default eventRouter;
