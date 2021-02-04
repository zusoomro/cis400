import express, { Request, Response } from "express";
import Event from "../../models/Event";
import auth, { AuthRequest } from "../authMiddleware";
import Pod from "../../models/Pod";
import User from "../../models/User";
import { getPodEvents } from "./pods";
import {
  ConflictBuffer,
  determineTravelTimeConflicts,
  getOverlappingEvents,
  getPreviousAndNextEvent,
} from "./eventConflictFunctions";

let eventRouter = express.Router();

// Create an event
eventRouter.post("/", [auth], async (req: Request, res: Response) => {
  const {
    name,
    formattedAddress,
    start_time,
    end_time,
    lat,
    lng,
    repeat,
    notes,
    priority,
    startFormattedAddress,
    startLat,
    startLng,
  } = req.body;

  if (
    !name ||
    !formattedAddress ||
    !start_time ||
    !end_time ||
    !repeat ||
    !startFormattedAddress
  ) {
    return res
      .status(400)
      .json({ message: "Please fill out the required fields." });
  }

  if (end_time < start_time) {
    return res
      .status(400)
      .json({ message: "The start date must be before the end date." });
  }

  const id = (req as AuthRequest).user.id;
  const event = await Event.query().insert({
    ownerId: id,
    name,
    formattedAddress,
    lat,
    lng,
    startFormattedAddress,
    startLat,
    startLng,
    start_time: start_time,
    end_time: end_time,
    repeat,
    notes,
    priority,
  });
  console.log(`Creating event with name '${event.name}' and id '${event.id}'`);
  res.send({ event });
});

// Modify the event
eventRouter.put("/", [auth], async (req: Request, res: Response) => {
  const {
    name,
    formattedAddress,
    lat,
    lng,
    start_time,
    end_time,
    repeat,
    notes,
    priority,
    startFormattedAddress,
    startLat,
    startLng,
  } = req.body;
  if (
    !name ||
    !formattedAddress ||
    !start_time ||
    !end_time ||
    !repeat ||
    !startFormattedAddress
  ) {
    return res
      .status(400)
      .json({ message: "Please fill out the required fields." });
  }

  if (end_time < start_time) {
    return res
      .status(400)
      .json({ message: "The start date must be before the end date." });
  }

  const eventId = req.body.id;
  await Event.query()
    .update({
      name,
      formattedAddress,
      lat,
      lng,
      startFormattedAddress,
      startLat,
      startLng,
      start_time,
      end_time,
      repeat,
      notes,
      priority,
    })
    .where("id", eventId);
  const eventForReturn = await Event.query().where("id", eventId);
  res.send({ eventForReturn });
});

// Get api key
eventRouter.get(
  "/apiKey",
  [auth],
  async (req: express.Request, res: express.Response) => {
    try {
      const key = process.env.GOOGLE_MAPS_API_KEY;

      res.json({ key });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// Assume all this data is good for now
eventRouter.post("/proposeEvent", async (req: Request, res: Response) => {
  try {
    const { event, podId } = req.body;

    // Determine if there are any immediately conflicting events
    let events: Event[] = await getPodEvents(podId);

    // Filter out current event if it exists
    if (event.id) {
      events = events.filter((eventItem) => eventItem.id != event.id);
    }

    let conflictingEvents = getOverlappingEvents(event, events);
    let conflictingBuffers: ConflictBuffer[] = [];

    // If there are immediately conflicting events, return them
    if (conflictingEvents.length) {
      return res.json({
        isConflicting: true,
        conflictingEvents,
        conflictingBuffers,
      });
    }

    // Determine the next event and previous event in the schedule
    const { previousEvent, nextEvent } = getPreviousAndNextEvent(event, events);

    // Determine the travel time between those events and the proposed event
    return res.json(
      await determineTravelTimeConflicts(event, previousEvent, nextEvent)
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

eventRouter.get(
  "/",
  [auth],
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req as AuthRequest).user.id;
      const eventsList = await Event.query().where("ownerId", userId);
      res.json({ events: eventsList });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error when getting events");
    }
  }
);

eventRouter.delete("/", async (req: Request, res: Response) => {
  const eventId = req.body.id;
  const event = await Event.query().deleteById(eventId);

  res.json({ event });
});

eventRouter.get(
  "/event/:eventId",
  [auth],
  async (req: Request, res: Response) => {
    const { eventId } = req.params;
    try {
      console.log("id", eventId);
      const event = await Event.query().findOne({ "events.id": eventId });

      res.json({ event });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

eventRouter.get(
  "/:podId",
  [auth],
  async (req: express.Request, res: express.Response) => {
    try {
      const podId = req.params.podId;

      const pod = await Pod.query()
        .findOne({ "pods.id": podId })
        .withGraphFetched("members");

      console.log("pod", pod);

      const allEvents: Event[] = await Event.query().whereIn(
        "ownerId",
        pod.members.map((m: User) => m.id)
      );

      res.json({ events: allEvents });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error when getting events" });
    }
  }
);

export default eventRouter;
