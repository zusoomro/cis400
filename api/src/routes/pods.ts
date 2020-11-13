import express from "express";
import { isConstructorDeclaration } from "typescript";
import Pod from "../../models/Pod";
import User from "../../models/User";
import PodInvites from "../../models/PodInvites";
import auth, { AuthRequest } from "../authMiddleware";
import Event from "../../models/Event";
import eventRouter from "./events";
import { compare } from "bcrypt";

const podsRouter = express.Router();

podsRouter.get("/", async (req, res) => {
  const response = await Pod.query();
  console.log(response);
  res.json(response);
});

// used to create a new pod
podsRouter.post(
  "/",
  [auth],
  async (req: express.Request, res: express.Response) => {
    console.log(req.body);
    const { user } = req as AuthRequest;
    const currUser = (req as AuthRequest).user.id;
    const name: string = req.body.name;

    const inviteeIds: Array<number> = req.body.inviteeIds;

    // add a pop to the pods database
    const pod = await Pod.query().insert({
      ownerId: currUser,
      name: name,
    });

    await pod.$relatedQuery("members").relate(user.id);

    inviteeIds.forEach(async (id) => {
      const invite = await PodInvites.query().insert({
        inviteeUserId: id,
        inviterUserId: currUser,
        podId: pod.id,
      });
    });

    console.log("Created pod: ", pod);
    res.send(pod);
  }
);

podsRouter.get(
  "/currUsersPod",
  [auth],
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = (req as AuthRequest).user.id;
      const podsList = await Pod.query()
        .joinRelated("members")
        .where("members.id", userId)
        .withGraphFetched("members");
      res.json({ pod: podsList });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

podsRouter.get(
  "/:podId/conflictingEvents",
  [auth],
  async (req: express.Request, res: express.Response) => {
    const podId = req.params.podId;
    console.log("conflicting events");
    try {
      const pod = await Pod.query()
        .findOne({ "pods.id": podId })
        .withGraphFetched("members");

      if (
        !pod.members.map((m) => m.id).includes((req as AuthRequest).user.id)
      ) {
        return res
          .status(401)
          .json({ message: "You are not authorized to make this request." });
      }

      const allEvents: Event[] = await Event.query().whereIn(
        "ownerId",
        pod.members.map((m) => m.id)
      );

      console.log("allevents", allEvents);

      const podMemberDict: { [key: string]: string } = {};
      for (const member of pod.members) {
        podMemberDict[member.id] = member.email;
      }

      const conflictingEvents: Event[] = getConflictingEvents(allEvents);

      console.log("conflictingEvents", conflictingEvents);

      res.json({ events: conflictingEvents, members: podMemberDict });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error when getting events" });
    }
  }
);

class Endpoint {
  time: Date;
  id: number;
  isEnd: boolean;

  constructor(time: Date, id: number, isEnd: boolean) {
    this.time = time;
    this.id = id;
    this.isEnd = isEnd;
  }
}

export const getConflictingEvents = (events: Event[]): Event[] => {
  const conflictingEvents: Event[] = [];
  const iterationArray: Endpoint[] = [];

  // Construct a dict/hashmap
  const dict: { [key: number]: Event } = {};
  for (const event of events) {
    dict[event.id] = event;
  }

  for (const event of events) {
    iterationArray.push(new Endpoint(event.start_time, event.id, false));
    iterationArray.push(new Endpoint(event.end_time, event.id, true));
  }

  iterationArray.sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  console.log("iterationArray", iterationArray);

  let numOpenIntervals = 0;
  let lastEndpoint: Endpoint | undefined = undefined;

  for (const point of iterationArray) {
    if (point.isEnd) {
      numOpenIntervals--;
    } else {
      if (numOpenIntervals === 1 && lastEndpoint) {
        console.log("hello", dict[lastEndpoint.id], dict[point.id]);
        conflictingEvents.push(dict[lastEndpoint.id]);
        conflictingEvents.push(dict[point.id]);
      } else if (numOpenIntervals > 1) {
        conflictingEvents.push(dict[point.id]);
      }
      numOpenIntervals++;
      lastEndpoint = point;
    }
  }

  // const conflictingEvents: Event[] = [];
  // let latest: Date = new Date("1970-01-01Z00:00:00:000");
  //
  // events.sort((a, b) =>
  //   compareDatesFromStrings(
  //     (a.start_time as unknown) as string,
  //     (b.start_time as unknown) as string
  //   )
  // );
  //
  // for (const event of events) {
  //   const event_start = new Date(event.start_time);
  //   const event_end = new Date(event.end_time);
  //   console.log("hi");
  //   if (event_start < latest) {
  //     // It's overlapping
  //     console.log("would push");
  //     conflictingEvents.push(event);
  //   }
  //   if (event_end > latest) {
  //     console.log("is later");
  //     latest = new Date(event.end_time);
  //   }
  // }

  return conflictingEvents;
};

const compareDatesFromStrings = (a: string, b: string): number => {
  return new Date(a).getTime() - new Date(b).getTime();
};

export default podsRouter;
