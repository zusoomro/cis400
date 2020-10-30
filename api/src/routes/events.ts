import express, { Request, Response } from "express";
import Event from "../../models/Event";
import auth, { AuthRequest } from "../authMiddleware"

let eventRouter = express.Router();

eventRouter.get("/", async (req, res) => {
  const response = await Event.query();
  console.log(response);
  res.json(response);
});

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

eventRouter.get("/:ownerId", async (req, res) => {
  console.log("/events/ownerId");
  const inputOwnerId = req.params.ownerId;
  console.log("inputOwnerId", inputOwnerId);
  const eventsForUser = await Event.query().where("ownerId", inputOwnerId);
  res.json(eventsForUser);
});

export default eventRouter;
