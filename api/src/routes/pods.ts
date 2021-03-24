import express from "express";
import { isConstructorDeclaration } from "typescript";
import Pod from "../../models/Pod";
import User from "../../models/User";
import PodInvites from "../../models/PodInvites";
import auth, { AuthRequest } from "../authMiddleware";
import Event from "../../models/Event";
import eventRouter from "./events";
import { compare } from "bcrypt";
import moment from "moment";

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
    const lat: number = req.body.lat;
    const lng: number = req.body.lng;
    const homeAddress: string = req.body.homeAddress;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Please add a name for your pod." });
    }

    if (name.length < 3) {
      return res
        .status(400)
        .json({ message: "Pod name must be more than two characters." });
    }

    if (!homeAddress) {
      return res.status(400).json({ message: "Pod requires a home address." });
    }

    const inviteeIds: Array<number> = req.body.inviteeIds;

    // add a pod to the pods database
    const pod = await Pod.query().insert({
      ownerId: currUser,
      name: name,
      homeAddress: homeAddress,
      lat: lat,
      lng: lng,
    });

    await pod.$relatedQuery("members").relate(user.id);

    // Set curr user to have inPod field be true
    await User.query().where("id", currUser).patch({ inPod: true });

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
      const pod = await Pod.query()
        .joinRelated("members")
        .where("members.id", userId)
        .withGraphFetched("members");

      res.json({ pod: pod[0] });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

export const getPodEvents = async (podId: number) => {
  console.log("podId in getPodEvents", podId);
  const pod = await Pod.query()
    .findOne({ "pods.id": podId })
    .withGraphFetched("members");

  const allEvents: Event[] = await Event.query().whereIn(
    "ownerId",
    pod.members.map((m) => m.id)
  );

  return allEvents;
};

/** Returns pod events between 8am and 6pm of the day given  */
export const getPodEventsOfDay = async (podId: number, date: Date) => {
  const pod = await Pod.query()
    .findOne({ "pods.id": podId })
    .withGraphFetched("members");

  const dateAsMoment = moment(date);
  const startOfDay = moment(dateAsMoment).hour(8).minute(0);
  const endOfDay = moment(dateAsMoment).hour(18).minute(0); //6pm = 12 + 6

  const allEvents: Event[] = await Event.query()
    .whereIn(
      "ownerId",
      pod.members.map((m) => m.id)
    )
    // Need to use .toISOString to compare dates because the dates are stored
    // In UTC time and then converted to local time only when displayed.
    .andWhere("start_time", ">", typeof(__DEV__) != undefined ? startOfDay.toISOString() : startOfDay.toDate())  // after 8 am on date
    .andWhere("end_time", "<", typeof(__DEV__) != undefined ? endOfDay.toISOString(): endOfDay.toDate()); // before 6pm on date

  return allEvents;
};

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

      const podMemberDict: { [key: string]: string } = {};
      for (const member of pod.members) {
        podMemberDict[member.id] = member.email;
      }

      const conflictingEvents: Event[] = getConflictingEvents(allEvents);

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
  return conflictingEvents;
};

const compareDatesFromStrings = (a: string, b: string): number => {
  return new Date(a).getTime() - new Date(b).getTime();
};

export default podsRouter;
