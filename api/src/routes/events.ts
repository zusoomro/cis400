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
  const { name, address, startTime, endTime, notes } = req.body;

  // events doNT HAVE NAMES YET
  const event = await Event.query().insert({
    ownerId: 1,
    //name: name,
    address: address,
    start_time: startTime,
    end_time: endTime,
    notes: notes,
  });

  console.log(`Creating event with name '${event.name}' and id '${event.id}'`);
});

Event.query().insert({
  start_time: new Date("2020-10-26T09:30:00"),
  end_time: new Date("2020-10-26T10:00:00"),
  //name: "Event 1",
  //id: 1,
  ownerId: 2,
  address: "my butt",
  notes: "booty",
});
Event.query().insert({
  start_time: new Date("2020-10-26T11:00:00"),
  end_time: new Date("2020-10-26T13:00:00"),
  // name: "Event 2",
  //id: 2,
  ownerId: 2,
  address: "ur butt",
  notes: "boooty",
});
Event.query().insert({
  start_time: new Date("2020-10-26T15:00:00"),
  end_time: new Date("2020-10-26T16:30:00"),
  //name: "Event 3",
  //id: 3,
  ownerId: 2,
  address: "his butt",
  notes: "booooty",
});
Event.query().insert({
  start_time: new Date("2020-03-26T18:00:00"),
  end_time: new Date("2020-03-26T19:00:00"),
  //name: "Event 4",
  //id: 4,
  ownerId: 2,
  address: "her butt",
  notes: "booooty",
});
Event.query().insert({
  start_time: new Date("2020-10-26T22:00:00"),
  end_time: new Date("2020-10-26T23:30:00"),
  //name: "Event 5",
  //id: 5,
  ownerId: 2,
  address: "ur MOMs butt",
  notes: "boooooty",
});

eventRouter.get("/:ownerId", async (req, res) => {
  console.log("/events/ownerId");
  const inputOwnerId = req.params.ownerId;
  console.log("inputOwnerId: ", inputOwnerId);
  const eventsForUser = await Event.query().where("ownerId", inputOwnerId);
  console.log(eventsForUser);
  res.json(eventsForUser);
});

export default eventRouter;
