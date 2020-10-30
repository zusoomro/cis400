import express, { Request, Response } from "express";
import Event from "../../models/Event";
import auth, { AuthRequest } from "../authMiddleware"

let eventRouter = express.Router();

eventRouter.post("/", [auth], async (req: Request, res: Response) => {
  console.log("Calling eventRouter.post");
  const { name, address, startTime, endTime, notes } = req.body;

  const id = (req as AuthRequest).user.id;
  const event = await Event.query().insert({
    ownerId: id,
    name,
    address,
    start_time: startTime,
    end_time: endTime,
    notes,
  });

  console.log(`Creating event with name '${event.name}' and id '${event.id}'`);
});

eventRouter.get(
  "/", 
  [auth], async (req: express.Request, res: express.Response) => {
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
