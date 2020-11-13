import express, { Request, Response } from "express";
import Event from "../../models/Event";
import User from "../../models/User";
import auth, { AuthRequest } from "../authMiddleware";

let eventRouter = express.Router();

eventRouter.post("/", [auth], async (req: Request, res: Response) => {
  console.log("Calling eventRouter.post");
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
  const eventId = req.body.id;

  console.log("eventid", eventId);

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

eventRouter.get("/apiKey", [auth], async (req: express.Request, res: express.Response) => {
  try {
    const key = process.env.GOOGLE_MAPS_API_KEY;

    res.json({ key });
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

eventRouter.get(
  "/:podId",
  [auth],
  async (req: express.Request, res: express.Response) => {
    try {
      const podId = req.params.podId;
      const users = await User.query().where("podId", podId);
      const eventsList: Event[] = [];
      await Promise.all(
        users.map(async (user) => {
          const eventsForUser = await Event.query().where("ownerId", user.id);
          await Promise.all(
            eventsForUser.map(async (event) => {
              eventsList.push(event);
            })
          );
        })
      );
      res.json({ events: eventsList });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error when getting events");
    }
  }
);

export default eventRouter;
