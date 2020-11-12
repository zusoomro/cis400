import express, { Request, Response } from "express";
import Event from "../../models/Event";
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
  const { name, formattedAddress, lat, lng, start_time, end_time, repeat, notes } = req.body;
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

export default eventRouter;
