import express, { Request, Response } from "express";
import Event from "../../models/Event";
import User from "../../models/User";
import auth, { AuthRequest } from "../authMiddleware";

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
      console.log("yo getting events for the pod squad");
      const podId = req.body.podId; // get podId from request body
      const users = User.query().where("podId", podId);
      let eventsList: Event[] = [];
      (await users).forEach((user) => {
        eventsList.push.apply(Event.query().where("ownerId", user.id));
      });

      // const allEventsTempTable = Event.query();
      // const validUsersTempTable = User.query().where("podId", podId);
      // const validEvents = User.query()

      // const eventsList = User.query()
      //   .select("event.*", "user.*")
      //   .innerJoin("event", "user.id", "event.ownerId")
      //   .where("user.podId", podId);
      res.json({ events: eventsList });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error when getting events");
    }
  }
);

export default eventRouter;
