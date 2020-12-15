import { app } from "../index";
import request from "supertest";
import Knex from "knex";
import initializeDb from "../initializeDb";
import Event from "../../models/Event";
import {
  getPreviousAndNextEvent,
  determineTravelTimeConflicts,
  getOverlappingEvents,
} from "./eventConflictFunctions";

let knex: Knex;

beforeEach(async () => {
  knex = initializeDb();
  await knex.migrate.latest();
  await knex.seed.run();
});

const oneEventInsideAnother: Event[] = [
  {
    id: 1,
    ownerId: 1,
    formattedAddress: "3934 Pine St, Philadelphia, PA 19104, USA",
    start_time: new Date("2019-11-13T03:10:33.447Z"),
    end_time: new Date("2021-11-13T04:10:33.447Z"),
    notes: "Bike ride time.",
    name: "Go for a bike ride",
    lat: 39.95034599999999,
    lng: -75.201981,
    repeat: "weekly",
  } as Event,
  {
    id: 2,
    ownerId: 1,
    formattedAddress: "3934 Pine St, Philadelphia, PA 19104, USA",
    start_time: new Date("2020-11-13T03:10:33.447Z"),
    end_time: new Date("2020-11-13T04:10:33.447Z"),
    notes: "Bike ride time. 2020.",
    name: "Go for a bike ride in 2020",
    lat: 39.95034599999999,
    lng: -75.201981,
    repeat: "weekly",
  } as Event,
];

const nonConflictingEvents: Event[] = [
  {
    id: 1,
    ownerId: 1,
    formattedAddress: "3934 Pine St, Philadelphia, PA 19104, USA",
    start_time: new Date("2019-11-13T03:10:33.447Z"),
    end_time: new Date("2019-11-13T04:10:33.447Z"),
    notes: "Bike ride time.",
    name: "Go for a bike ride",
    lat: 39.95034599999999,
    lng: -75.201981,
    repeat: "weekly",
  } as Event,
  {
    id: 3,
    ownerId: 1,
    formattedAddress: "3934 Pine St, Philadelphia, PA 19104, USA",
    start_time: new Date("2020-11-13T03:10:33.447Z"),
    end_time: new Date("2020-11-13T04:10:33.447Z"),
    notes: "Bike ride time. 2020.",
    name: "Go for a bike ride in 2020",
    lat: 39.95034599999999,
    lng: -75.201981,
    repeat: "weekly",
  } as Event,
  {
    id: 2,
    ownerId: 3,
    formattedAddress: "1204 Walnut St, Philadelphia, PA 19107, USA",
    start_time: new Date("2021-11-13T04:20:08.731Z"),
    end_time: new Date("2021-11-13T05:20:08.731Z"),
    notes: "Nail time.",
    name: "Get nails done",
    lat: 39.94884270000001,
    lng: -75.1608773,
    repeat: "no_repeat",
  } as Event,
];

const travelTimeConflictingEvents = [
  {
    id: 1,
    ownerId: 1,
    formattedAddress: "3934 Pine St, Philadelphia, PA 19104, USA",
    start_time: "2020-11-13T03:10:33.447Z",
    end_time: "2020-11-13T04:20:33.447Z",
    notes: "Bike ride time.",
    name: "Go for a bike ride",
    lat: 39.95034599999999,
    lng: -75.201981,
    repeat: "weekly",
  },
  {
    id: 2,
    ownerId: 3,
    formattedAddress: "1204 Walnut St, Philadelphia, PA 19107, USA",
    start_time: "2020-11-13T04:20:08.731Z",
    end_time: "2020-11-13T05:20:08.731Z",
    notes: "Nail time.",
    name: "Get nails done",
    lat: 39.94884270000001,
    lng: -75.1608773,
    repeat: "no_repeat",
  },
  {
    id: 3,
    ownerId: 1,
    formattedAddress: "3934 Pine St, Philadelphia, PA 19104, USA",
    start_time: "2020-11-13T05:20:33.447Z",
    end_time: "2020-11-13T06:20:33.447Z",
    notes: "Bike ride time. 2",
    name: "Go for a bike ride 2",
    lat: 39.95034599999999,
    lng: -75.201981,
    repeat: "weekly",
  },
];

describe("the conflict finder functions", () => {
  // describe("getTravelTime", () => {
  //   it("reaches the mapquest api", () => {});

  //   it("returns the realTime", () => {});
  // });

  describe("getPreviousAndNextEvent", () => {
    it("gets the right events when there are two", () => {
      const { previousEvent, nextEvent } = getPreviousAndNextEvent(
        (nonConflictingEvents[1] as unknown) as Event,
        [nonConflictingEvents[0], nonConflictingEvents[2]] as Event[]
      );

      expect(previousEvent).toBeTruthy();
      expect(nextEvent).toBeTruthy();

      expect(previousEvent!.id).toBe(1);
      expect(nextEvent!.id).toBe(2);
    });
    it("gets the previous event and no next event", () => {
      const {
        previousEvent,
        nextEvent,
      } = getPreviousAndNextEvent(
        (nonConflictingEvents[1] as unknown) as Event,
        [nonConflictingEvents[0]]
      );

      expect(previousEvent).toBeTruthy();
      expect(nextEvent).toBeUndefined();

      expect(previousEvent!.id).toBe(1);
    });
    it("gets the next event and no previous event", () => {
      const {
        previousEvent,
        nextEvent,
      } = getPreviousAndNextEvent(
        (nonConflictingEvents[1] as unknown) as Event,
        [nonConflictingEvents[2]]
      );

      expect(previousEvent).toBeUndefined();
      expect(nextEvent).toBeTruthy();

      expect(nextEvent!.id).toBe(2);
    });
    it("returns null when there are no other events", () => {
      const { previousEvent, nextEvent } = getPreviousAndNextEvent(
        (nonConflictingEvents[1] as unknown) as Event,
        []
      );

      expect(previousEvent).toBeUndefined();
      expect(nextEvent).toBeUndefined();
    });
  });

  describe("determineTravelTimeConflicts", () => {
    it("determines travel time conflicts correctly with a start conflict", async () => {
      const {
        conflictingEvents,
        conflictingBuffers,
        isConflicting,
      } = await determineTravelTimeConflicts(
        (travelTimeConflictingEvents[0] as unknown) as Event,
        undefined,
        (travelTimeConflictingEvents[1] as unknown) as Event
      );

      expect(conflictingEvents.length).toBe(1);
      expect(conflictingBuffers.length).toBe(1);
      expect(isConflicting).toBe(true);
    });

    it("determines a double time conflict correctly", async () => {
      const {
        conflictingEvents,
        conflictingBuffers,
        isConflicting,
      } = await determineTravelTimeConflicts(
        (travelTimeConflictingEvents[1] as unknown) as Event,
        (travelTimeConflictingEvents[0] as unknown) as Event,
        (travelTimeConflictingEvents[2] as unknown) as Event
      );

      expect(conflictingEvents.length).toBe(2);
      expect(conflictingBuffers.length).toBe(2);
      expect(isConflicting).toBe(true);
    });

    it("returns no conflict when you have enough travel time", async () => {
      const {
        conflictingEvents,
        conflictingBuffers,
        isConflicting,
      } = await determineTravelTimeConflicts(
        (travelTimeConflictingEvents[0] as unknown) as Event,
        undefined,
        (travelTimeConflictingEvents[2] as unknown) as Event
      );

      expect(conflictingEvents.length).toBe(0);
      expect(conflictingBuffers.length).toBe(0);
      expect(isConflicting).toBe(false);
    });
  });

  describe("getOverlappingEvents", () => {
    it("finds conflict when proposed event is fully inside an existing event", () => {
      const overlappingEvents = getOverlappingEvents(oneEventInsideAnother[1], [
        oneEventInsideAnother[0],
      ]);

      expect(overlappingEvents.length).toBe(1);
    });
    it("finds conflict when existing event is inside proposed event", () => {
      const overlappingEvents = getOverlappingEvents(oneEventInsideAnother[0], [
        oneEventInsideAnother[1],
      ]);

      expect(overlappingEvents.length).toBe(1);
    });
    // it("finds the conflict from an event end conflicting into this event", () => {});
    // it("finds the conflict from an event start conflicting into this event", () => {});
  });
});
