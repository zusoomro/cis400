import fetch from "node-fetch";
import express, { Request, Response } from "express";
import Event from "../../models/Event";
import auth, { AuthRequest } from "../authMiddleware";
import Pod from "../../models/Pod";
import { getPodEvents } from "./pods";
import moment from "moment";

let eventRouter = express.Router();

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
  } = req.body;

  if (!name || !formattedAddress || !start_time || !end_time || !repeat) {
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
    start_time: start_time,
    end_time: end_time,
    repeat,
    notes,
  });

  console.log(`Creating event with name '${event.name}' and id '${event.id}'`);
});

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
  } = req.body;

  if (!name || !formattedAddress || !start_time || !end_time || !repeat) {
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
  const id = (req as AuthRequest).user.id;
  const event = await Event.query()
    .update({
      name,
      formattedAddress,
      lat,
      lng,
      start_time,
      end_time,
      repeat,
      notes,
    })
    .where("id", eventId);
});

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

type proposalResponseSchema = {
  conflictingEvents: Event[];
};

class Endpoint {
  time: Date;
  event: Event;

  constructor(time: Date, event: Event) {
    this.time = time;
    this.event = event;
  }
}

const getProposedEventsConflictingEvents = (
  proposedEvent: Event,
  existingEvents: Event[]
) => {
  const endpointTimes: Endpoint[] = [];
  const eventsAdded = new Set();
  const conflictingEvents = [];

  existingEvents.forEach((event) => {
    endpointTimes.push(new Endpoint(event.start_time, event));
    endpointTimes.push(new Endpoint(event.end_time, event));
  });

  for (const endpoint of endpointTimes) {
    if (
      endpoint.time >= proposedEvent.start_time &&
      endpoint.time <= proposedEvent.end_time &&
      !eventsAdded.has(endpoint.event.id)
    ) {
      conflictingEvents.push(endpoint.event);
      eventsAdded.add(endpoint.event.id);
    }
  }

  return conflictingEvents;
};

const getPreviousAndNextEvent = (proposedEvent: Event, events: Event[]) => {
  let previousEvent: Event | undefined = undefined;
  let nextEvent: Event | undefined = undefined;

  for (const event of events) {
    if (
      event.end_time <= proposedEvent.start_time &&
      (previousEvent == undefined || event.end_time >= previousEvent.end_time)
    ) {
      previousEvent = event;
    } else if (
      event.start_time >= proposedEvent.end_time &&
      (nextEvent == undefined || event.start_time <= nextEvent.start_time)
    ) {
      nextEvent = event;
    }
  }

  return { previousEvent, nextEvent };
};

// Returns the travel time in minutes
export const getTravelTime = async (firstEvent: Event, secondEvent: Event) => {
  const res = await fetch(
    `http://www.mapquestapi.com/directions/v2/route?key=zDTYEvSBZwi8zypUKkAhDBzvxY6sSQ4J`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locations: [
          {
            latLng: {
              lat: firstEvent.lat,
              lng: firstEvent.lng,
            },
          },
          {
            latLng: {
              lat: secondEvent.lat,
              lng: secondEvent.lng,
            },
          },
        ],
      }),
    }
  );

  // route.realTime is in seconds, convert it to minutes
  const travelTime = (await res.json()).route.realTime / 60;
  return travelTime;
};

const determineTravelTimeConflicts = async (
  proposedEvent: Event,
  previousEvent: Event | undefined,
  nextEvent: Event | undefined
) => {
  const conflictingEvents: Event[] = [];
  const conflictingBuffers: Buffer[] = [];

  // Travel time is in minutes
  if (previousEvent) {
    const firstTravelTime = await getTravelTime(previousEvent, proposedEvent);
    var diffMinutes = Math.abs(
      moment(previousEvent.end_time).diff(proposedEvent.start_time, "minutes")
    );
    if (firstTravelTime >= diffMinutes) {
      conflictingEvents.push(previousEvent);
      conflictingBuffers.push({
        firstEventId: previousEvent.id,
        secondEventId: proposedEvent.id,
        availableTime: diffMinutes,
        travelTime: firstTravelTime,
      });
    }
  }

  // Travel time is in minutes
  if (nextEvent) {
    const secondTravelTime = await getTravelTime(proposedEvent, nextEvent);
    var diffMinutes = Math.abs(
      moment(nextEvent.end_time).diff(proposedEvent.start_time, "minutes")
    );
    if (secondTravelTime >= diffMinutes) {
      conflictingEvents.push(nextEvent);
      conflictingBuffers.push({
        firstEventId: proposedEvent.id,
        secondEventId: nextEvent.id,
        availableTime: diffMinutes,
        travelTime: secondTravelTime,
      });
    }
  }

  return {
    isConflicting: conflictingEvents.length ? true : false,
    conflictingEvents,
    conflictingBuffers,
  };
};

type Buffer = {
  firstEventId: number;
  secondEventId: number;
  availableTime: number;
  travelTime: number;
};

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

    let conflictingEvents = getProposedEventsConflictingEvents(event, events);
    let conflictingBuffers: Buffer[] = [];

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
  console.log("eventid", eventId);

  // const id = (req as AuthRequest).user.id;
  const event = await Event.query().deleteById(eventId);
  console.log("event", event);
  res.json({ event });
});

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
        pod.members.map((m) => m.id)
      );

      res.json({ events: allEvents });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error when getting events" });
    }
  }
);

export default eventRouter;
