import express, { Request, Response } from "express";
import Event from "../../models/Event";
import auth, { AuthRequest } from "../authMiddleware";
import Pod from "../../models/Pod";

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
