import express, { Request, Response } from "express";
import Pod from "../../models/Pod";
import fetch from "node-fetch";
import Event from "../../models/Event";
import auth, { AuthRequest } from "../authMiddleware";

let analyticsRouter = express.Router();

type podsReturnType = {
  milesTraveled: number;
  numTrips: number;
  travelTime: number;
};

type breakdownReturnType = Array<{
  userId: number;
  email: string;
  numTrips: number;
  gasUsage: number;
  timeUsage: number;
  gasPercentage: number;
  timePercentage: number;
}>;

enum timeOption {
  Month,
  Week,
}

const retrievePodAndEvents = async (
  podId: string,
  time: timeOption
): Promise<{
  pod: Pod;
  events: Event[];
}> => {
  const pod = await Pod.query()
    .findOne({ "pods.id": podId })
    .withGraphFetched("members");

  if (!pod) {
    throw new Error();
  }

  const userIds = pod.members.map((user) => user.id);

  let events;
  const date: Date = new Date();

  if (time == timeOption.Month) {
    date.setMonth(date.getMonth() - 1);
  } else {
    // Last week
    date.setDate(date.getDate() - 7);
  }

  events = await Event.query()
    .whereIn("ownerId", userIds)
    .where("start_time", ">", date.toISOString());

  return { pod, events };
};

const getMapquestData = async (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
) => {
  const apiResponse = await fetch(
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
              lat: startLat,
              lng: startLng,
            },
          },
          {
            latLng: {
              lat: endLat,
              lng: endLng,
            },
          },
        ],
      }),
    }
  );

  const json = apiResponse.json();

  return json;
};

/*
 Returns aggregated data on a pod on a monthly or weekly basis. Default if no
 query param is provided is monthly. Query param is time, so /pods/0/?time=month
 or week
 */
analyticsRouter.get(
  "/pods/:podId/",
  [auth],
  async (req: Request, res: Response) => {
    const time = req.query.time == "week" ? timeOption.Week : timeOption.Month;

    try {
      const { pod, events } = await retrievePodAndEvents(
        req.params.podId,
        time
      );

      const returnVal: podsReturnType = {
        milesTraveled: 0,
        numTrips: events.length,
        travelTime: 0,
      };

      // Use mapquest api to get the miles traveled and travel time
      for (let event of events) {
        if (!event.startLat || !event.startLng || !event.lat || !event.lng) {
          return res.status(500).json({
            msg:
              "An event does not have correct location information. This api endpoint expects" +
              "start and end lats and lngs.",
          });
        }

        const data = await getMapquestData(
          event.startLat,
          event.startLng,
          event.lat,
          event.lng
        );

        // Round trip, so multiply distance and time by two
        returnVal.travelTime += data.route.time * 2;
        returnVal.milesTraveled += data.route.distance * 2;
      }

      return res.json(returnVal);
    } catch (err) {
      return res
        .status(400)
        .json({ msg: "We could not find the specified pod." });
    }
  }
);

analyticsRouter.get(
  "/breakdown/:podId/",
  [auth],
  async (req: Request, res: Response) => {
    const time = req.query.time == "week" ? timeOption.Week : timeOption.Month;

    try {
      const { pod, events } = await retrievePodAndEvents(
        req.params.podId,
        time
      );

      let aggregatedData = {
        milesTraveled: 0,
        travelTime: 0,
        gasUsage: 0,
      };

      const perUserData: breakdownReturnType = [];

      // Use mapquest api to get the miles traveled and travel time
      for (let event of events) {
        // If the user does not already have an entry in the array
        if (
          perUserData.filter((entry) => entry.userId == event.ownerId).length ==
          0
        ) {
          perUserData.push({
            userId: event.ownerId,
            email: pod.members.find((member) => member.id == event.ownerId)
              .email,
            numTrips: 0,
            gasUsage: 0,
            timeUsage: 0,
            gasPercentage: 0,
            timePercentage: 0,
          });
        }

        if (!event.startLat || !event.startLng || !event.lat || !event.lng) {
          return res.status(500).json({
            msg: "Some events do not have correct location information",
          });
        }

        const data = await getMapquestData(
          event.startLat,
          event.startLng,
          event.lat,
          event.lng
        );

        // Update the per user stats
        const userEntry = perUserData.find(
          (entry) => entry.userId == event.ownerId
        )!;

        // Multiply by two because of the round trip
        userEntry.numTrips += 1;
        userEntry.gasUsage += data.route.fuelUsed * 2;
        userEntry.timeUsage += data.route.time * 2;

        // Update the aggregate stats. Again, multiply by two because of the round
        // trip
        aggregatedData.travelTime += data.route.time * 2;
        aggregatedData.milesTraveled += data.route.distance * 2;
        aggregatedData.gasUsage += data.route.fuelUsed * 2;
      }

      // Update the percentages per user
      for (const obj of perUserData) {
        obj.gasPercentage = obj.gasUsage / aggregatedData.gasUsage;
        obj.timePercentage = obj.timeUsage / aggregatedData.travelTime;
      }

      return res.json(perUserData);
    } catch (err) {
      return res
        .status(400)
        .json({ msg: "We could not find the specified pod." });
    }
  }
);

export default analyticsRouter;
