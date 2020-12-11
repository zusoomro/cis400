import fetch from 'node-fetch'
import express, { Request, Response } from "express";
import Event from "../../models/Event";
import auth, { AuthRequest } from "../authMiddleware";
import Pod from "../../models/Pod";
import { getPodEvents } from "./pods";

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
}

const getProposedEventsConflictingEvents = (proposedEvent: Event, existingEvents: Event[]) => {
  const endpointTimes: Date[] = []

  existingEvents.forEach((event) => {
    endpointTimes.push(event.start_time)
    endpointTimes.push(event.end_time)
  })

  for (const time of endpointTimes) {
    if (time >= proposedEvent.start_time && time <= proposedEvent.end_time) {
      return true
    }
  }

  return false
}

const getPreviousAndNextEvent = (proposedEvent: Event, events: Event[]) => {
  let previousEvent: Event | undefined = undefined;
  let nextEvent: Event | undefined = undefined;

  for (const event of events) {
    if (event.end_time <= proposedEvent.start_time && (previousEvent == undefined || event.end_time >= previousEvent.end_time)) {
      previousEvent = event
    } else if (event.start_time >= proposedEvent.end_time && (nextEvent == undefined || event.start_time <= nextEvent.start_time)) {
      nextEvent = event
    }
  }

  return { previousEvent, nextEvent }
}

const getTravelTime = async (firstEvent: Event, secondEvent: Event) => {
  console.log('json to send', JSON.stringify({
    locations: [
      {
        latLng: {
          lat: firstEvent.lat,
          lng: firstEvent.lng
        }
      },
      {
        latLng: {
          lat: secondEvent.lat,
          lng: secondEvent.lng
        }
      }
    ]
  }))
  const res = await fetch(`http://www.mapquestapi.com/directions/v2/route?key=zDTYEvSBZwi8zypUKkAhDBzvxY6sSQ4J`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      locations: [
        {
          latLng: {
            lat: firstEvent.lat,
            lng: firstEvent.lng
          }
        },
        {
          latLng: {
            lat: secondEvent.lat,
            lng: secondEvent.lng
          }
        }
      ]
    })
  })

  // const travelTime = (await res.json()).route.time
  console.log('res', res)
  const text = await res.text()
  // const json = await res.json()
  console.log('test response', text)

  const travelTime = 2

  return travelTime
};

const determineTravelTimeConflicts = async (proposedEvent: Event, previousEvent: Event | undefined, nextEvent: Event | undefined) => {
  // Travel time is in minutes
  if (previousEvent) {
    const firstTravelTime = await getTravelTime(previousEvent, proposedEvent);
    var diff = Math.abs(+previousEvent.end_time - +proposedEvent.start_time);
    var minutes = Math.floor((diff / 1000) / 60);
    if (firstTravelTime >= minutes) {
      return true
    }
  }

  // Travel time is in minutes
  if (nextEvent) {
    const secondTravelTime = await getTravelTime(proposedEvent, nextEvent);
    var diff = Math.abs(+proposedEvent.end_time - +nextEvent.start_time);
    var minutes = Math.floor((diff / 1000) / 60);
    if (secondTravelTime >= minutes) {
      return true
    }
  }
  return false
}

// Assume all this data is good for now
eventRouter.post("/proposeEvent", async (req: Request, res: Response) => {
  console.log("req.body", req.body);
  try {
    const { event, podId } = req.body

    // Determine if there are any immediately conflicting events
    const events: Event[] = await getPodEvents(podId);

    // If there are immediately conflicting events, return them
    if (getProposedEventsConflictingEvents(event, events)) {
      return res.json({ isConflicting: true })
    }

    // Determine the next event and previous event in the schedule
    const { previousEvent, nextEvent } = getPreviousAndNextEvent(event, events);

    // Determine the travel time between those events and the proposed event
    return res.json({ isConflicting: await determineTravelTimeConflicts(event, previousEvent, nextEvent) })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server Error" })
  }
})

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
