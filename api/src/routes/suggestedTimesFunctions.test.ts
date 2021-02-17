import Knex from "knex";
import initializeDb from "../initializeDb";
import Event from "../../models/Event";
import {
  getRoundedEvents,
  getBusyTimesArray,
  isIntervalFree,
  createNonConflictingTime,
  findSuggestedTimes,
  SuggestedTime,
} from "./suggestedTimesFunctions";

let knex: Knex;

beforeEach(async () => {
  knex = initializeDb();
  await knex.migrate.latest();
  await knex.seed.run();
});

// Event 1 is from 9 - 10:30 (should be rounded from 9 - 10:30)
// Event 2 is from 12:34 - 1:05 (Should be rounded to 12:30 - 1:30)
// Event 3 is from 3:10 - 5:40pm (should be rounded to 3:00 - 6)
const eventsOfTheDay: Event[] = [
  {
    id: 1,
    ownerId: 1,
    formattedAddress: "3934 Pine St, Philadelphia, PA 19104, USA",
    start_time: new Date("2019-11-13T09:00:33.44"),
    end_time: new Date("2021-11-13T10:30:33.44"),
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
    start_time: new Date("2019-11-13T12:34:33.44"),
    end_time: new Date("2021-11-13T13:05:33.44"),
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
    start_time: new Date("2019-11-13T15:10:33.44"),
    end_time: new Date("2021-11-13T17:40:33.44"),
    notes: "Bike ride time.",
    name: "Go for a bike ride",
    lat: 39.95034599999999,
    lng: -75.201981,
    repeat: "weekly",
  } as Event,
];

// 1 - 2 pm
const proposedEvent1: Event = {
  id: 1,
  ownerId: 1,
  formattedAddress: "3934 Pine St, Philadelphia, PA 19104, USA",
  start_time: new Date("2019-11-13T13:00:00.44"),
  end_time: new Date("2021-11-13T14:00:00.44"),
  notes: "Bike ride time.",
  name: "Go for a bike ride",
  lat: 39.95034599999999,
  lng: -75.201981,
  repeat: "weekly",
} as Event;

// 10-11:30
const proposedEvent2: Event = {
  id: 1,
  ownerId: 1,
  formattedAddress: "3934 Pine St, Philadelphia, PA 19104, USA",
  start_time: new Date("2019-11-13T10:00:00.44"),
  end_time: new Date("2021-11-13T11:30:00.44"),
  notes: "Bike ride time.",
  name: "Go for a bike ride",
  lat: 39.95034599999999,
  lng: -75.201981,
  repeat: "weekly",
} as Event;

// 10 - 12:30
const proposedEvent3: Event = {
  id: 1,
  ownerId: 1,
  formattedAddress: "3934 Pine St, Philadelphia, PA 19104, USA",
  start_time: new Date("2019-11-13T10:00:00.44"),
  end_time: new Date("2021-11-13T12:30:00.44"),
  notes: "Bike ride time.",
  name: "Go for a bike ride",
  lat: 39.95034599999999,
  lng: -75.201981,
  repeat: "weekly",
} as Event;

describe("getRoundedEventsTest", () => {
  const roundedEvents = getRoundedEvents(eventsOfTheDay);
  const re1 = roundedEvents[0];
  const re2 = roundedEvents[1];
  const re3 = roundedEvents[2];

  it("event1 start time shouldnt change", () => {
    expect(re1.originalEvent.id).toBe(1);

    expect(re1.roundedStartHour).toBe(9);
    expect(re1.startOnHalfHour).toBeFalsy();
  });
  it("event1 end time shouldnt change", () => {
    expect(re1.roundedEndHour).toBe(10);
    expect(re1.endOnHalfHour).toBeTruthy();
  });

  it("event2 start time is should be rounded down to half hour", () => {
    expect(re2.originalEvent.id).toBe(2);

    expect(re2.roundedStartHour).toBe(12);
    expect(re2.startOnHalfHour).toBeTruthy();
  });
  it("event2 end time should be rounded up to half hour", () => {
    expect(re2.roundedEndHour).toBe(13);
    expect(re2.endOnHalfHour).toBeTruthy();
  });

  it("event3 start time is rounded to down to hour", () => {
    expect(re3.originalEvent.id).toBe(3);

    expect(re3.roundedStartHour).toBe(15);
    expect(re3.startOnHalfHour).toBeFalsy();
  });
  it("event3 end time is rounded up to hour", () => {
    expect(re3.roundedEndHour).toBe(18);
    expect(re3.endOnHalfHour).toBeFalsy();
  });

  it("ProposedEvent1 shouldnt change", () => {
    const roundedEvent = getRoundedEvents([proposedEvent1])[0];
    expect(roundedEvent.roundedStartHour).toBe(13);
    expect(roundedEvent.roundedEndHour).toBe(14);
  });
});

describe("getBusyTimesArray", () => {
  const roundedEvents = getRoundedEvents(eventsOfTheDay);
  const chunksInHour = 2;
  const startingHour = 8;
  const busyTimesArray = getBusyTimesArray(
    roundedEvents,
    chunksInHour,
    startingHour
  );
  it("event1 was added correct", () => {
    expect(busyTimesArray[2]).toBeTruthy();
    expect(busyTimesArray[3]).toBeTruthy();
    expect(busyTimesArray[4]).toBeTruthy();
  });
  it("event2 was added correct", () => {
    expect(busyTimesArray[9]).toBeTruthy();
    expect(busyTimesArray[10]).toBeTruthy();
  });
  it("event3 was added correct", () => {
    expect(busyTimesArray[14]).toBeTruthy();
    expect(busyTimesArray[15]).toBeTruthy();
    expect(busyTimesArray[16]).toBeTruthy();
    expect(busyTimesArray[17]).toBeTruthy();
    expect(busyTimesArray[18]).toBeTruthy();
    expect(busyTimesArray[19]).toBeTruthy();
  });
  it("Nothing was added incorrectly", () => {
    expect(busyTimesArray[0]).toBeFalsy();
    expect(busyTimesArray[1]).toBeFalsy();
    expect(busyTimesArray[5]).toBeFalsy();
    expect(busyTimesArray[6]).toBeFalsy();
    expect(busyTimesArray[7]).toBeFalsy();
    expect(busyTimesArray[8]).toBeFalsy();
    expect(busyTimesArray[11]).toBeFalsy();
    expect(busyTimesArray[12]).toBeFalsy();
    expect(busyTimesArray[13]).toBeFalsy();
  });
});

describe("isIntervalFree", () => {
  const roundedEvents = getRoundedEvents(eventsOfTheDay);
  const chunksInHour = 2;
  const startingHour = 8;
  const busyTimesArray = getBusyTimesArray(
    roundedEvents,
    chunksInHour,
    startingHour
  );
  it("Single Chunk is free and not free", () => {
    expect(isIntervalFree(busyTimesArray, 0, 1)).toBeTruthy();
    expect(isIntervalFree(busyTimesArray, 3, 1)).toBeFalsy();
  });

  it("Large Chunk is free", () => {
    expect(isIntervalFree(busyTimesArray, 5, 4)).toBeTruthy();
    expect(isIntervalFree(busyTimesArray, 6, 2)).toBeTruthy();
    expect(isIntervalFree(busyTimesArray, 11, 3)).toBeTruthy();
  });
  it("Chunk is not free", () => {
    expect(isIntervalFree(busyTimesArray, 11, 4)).toBeFalsy();
    expect(isIntervalFree(busyTimesArray, 13, 2)).toBeFalsy();
    expect(isIntervalFree(busyTimesArray, 1, 2)).toBeFalsy();
    expect(isIntervalFree(busyTimesArray, 2, 6)).toBeFalsy();
  });
});

describe("createNonConflictingTime Tests", () => {
  const date = eventsOfTheDay[0].start_time;
  const chunksInHour = 2; // 30 second intervals
  const startingHour = 8; // start at 8am

  it("Time chunk starts and ends on half hour with > 1 chunk", () => {
    const suggestedTime = createNonConflictingTime(
      date,
      5,
      4,
      chunksInHour,
      startingHour
    );

    // 10:30 - 12:30
    const start = suggestedTime.start;
    const end = suggestedTime.end;

    expect(start.hour()).toBe(10);
    expect(start.minutes()).toBe(30);

    expect(end.hour()).toBe(12);
    expect(end.minutes()).toBe(30);
  });

  it("Time chunk starts on half hour ends on hour with > 1 chunk", () => {
    const suggestedTime = createNonConflictingTime(
      date,
      5,
      3,
      chunksInHour,
      startingHour
    );

    // 10:30 - 12:00
    const start = suggestedTime.start;
    const end = suggestedTime.end;

    expect(start.hour()).toBe(10);
    expect(start.minutes()).toBe(30);

    expect(end.hour()).toBe(12);
    expect(end.minutes()).toBe(0);
  });

  it("Time chunk starts on hour ends on hour with > 1 chunk", () => {
    const suggestedTime = createNonConflictingTime(
      date,
      0,
      2,
      chunksInHour,
      startingHour
    );

    // Should be 8 - 9:00
    const start = suggestedTime.start;
    const end = suggestedTime.end;

    expect(start.hour()).toBe(8);
    expect(start.minutes()).toBe(0);

    expect(end.hour()).toBe(9);
    expect(end.minutes()).toBe(0);
  });

  it("Time chunk starts on hour ends on half hour 1 chunk", () => {
    const suggestedTime = createNonConflictingTime(
      date,
      0,
      1,
      chunksInHour,
      startingHour
    );

    // Should be 8 - 8:30
    const start = suggestedTime.start;
    const end = suggestedTime.end;

    expect(start.hour()).toBe(8);
    expect(start.minutes()).toBe(0);

    expect(end.hour()).toBe(8);
    expect(end.minutes()).toBe(30);
  });

  it("Time chunk starts on hour ends on half hour 1 chunk", () => {
    const suggestedTime = createNonConflictingTime(
      date,
      12,
      1,
      chunksInHour,
      startingHour
    );

    // Should be 2 - 2:30
    const start = suggestedTime.start;
    const end = suggestedTime.end;

    expect(start.hour()).toBe(14);
    expect(start.minutes()).toBe(0);

    expect(end.hour()).toBe(14);
    expect(end.minutes()).toBe(30);
  });

  it("create time chunk on starts on half hour ends on hour 1 chunk", () => {
    const suggestedTime = createNonConflictingTime(
      date,
      7,
      1,
      chunksInHour,
      startingHour
    );

    // 11:30 - 12

    const start = suggestedTime.start;
    const end = suggestedTime.end;

    expect(start.hour()).toBe(11);
    expect(start.minutes()).toBe(30);

    expect(end.hour()).toBe(12);
    expect(end.minutes()).toBe(0);
  });
});

describe("findSuggestedTimes Tests", () => {
  it("Gets the 4 closest times for propsedEvent1: 1 hour long", () => {
    const suggestedTimes = findSuggestedTimes(
      proposedEvent1,
      eventsOfTheDay,
      4
    );

    suggestedTimes.then((response) => {
      const nonConflictingTimes = response.nonConflictingTimes;
      const time1 = nonConflictingTimes[0];
      expect(time1.start.hour()).toBe(13);
      expect(time1.start.minutes()).toBe(30);
      expect(time1.end.hour()).toBe(14);
      expect(time1.end.minutes()).toBe(30);

      const time2 = nonConflictingTimes[1];
      expect(time2.start.hour()).toBe(14);
      expect(time2.start.minutes()).toBe(0);
      expect(time2.end.hour()).toBe(15);
      expect(time2.end.minutes()).toBe(0);

      const time3 = nonConflictingTimes[2];
      expect(time3.start.hour()).toBe(11);
      expect(time3.start.minutes()).toBe(30);
      expect(time3.end.hour()).toBe(12);
      expect(time3.end.minutes()).toBe(30);

      const time4 = nonConflictingTimes[3];
      expect(time4.start.hour()).toBe(11);
      expect(time4.start.minutes()).toBe(0);
      expect(time4.end.hour()).toBe(12);
      expect(time4.end.minutes()).toBe(0);
    });
  });

  it("Only return max number of possibilities", () => {
    const suggestedTimes = findSuggestedTimes(
      proposedEvent1,
      eventsOfTheDay,
      20
    );

    suggestedTimes.then((response) => {
      const nonConflictingTimes = response.nonConflictingTimes;
      expect(nonConflictingTimes.length).toBe(6);
    });
  });

  it("Gets the 2 closest times for propsedEvent2: 1.5 hour long", () => {
    const suggestedTimes = findSuggestedTimes(
      proposedEvent2,
      eventsOfTheDay,
      2
    );

    suggestedTimes.then((response) => {
      const nonConflictingTimes = response.nonConflictingTimes;
      const time1 = nonConflictingTimes[0]; //10:30-12
      const time2 = nonConflictingTimes[1]; // 11-12:30

      expect(time1.start.hour()).toBe(10);
      expect(time1.start.minutes()).toBe(30);
      expect(time1.end.hour()).toBe(12);
      expect(time1.end.minutes()).toBe(0);

      expect(time2.start.hour()).toBe(11);
      expect(time2.start.minutes()).toBe(0);
      expect(time2.end.hour()).toBe(12);
      expect(time2.end.minutes()).toBe(30);
    });
  });

  it("Gets no times for propsedEvent3: no space works", () => {
    const suggestedTimes = findSuggestedTimes(
      proposedEvent3,
      eventsOfTheDay,
      2
    );

    suggestedTimes.then((response) => {
      const nonConflictingTimes = response.nonConflictingTimes;
      expect(nonConflictingTimes.length).toBe(0);
    });
  });
});
