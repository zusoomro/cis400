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
import { start } from "repl";

// Need to test createNonConflictingTime
// Test findSuggestedTimes

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

// type RoundedEvent = {
//     originalEvent: Event;

//     roundedStartHour: number; // 0-24 for hour of the day
//     startOnHalfHour: boolean; // 1 if rounded event starts on half hour, 0 otherwise
//     roundedEndHour: number; // 0-24 for hour of the day
//     endOnHalfHour: boolean; // 0 if rounded event end on half hour
//   };
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

// /**
//  * CreateNonConflictingTime creates the moment
//  * that does not conflict with existing events
//  * based on the size of the interval and current
//  * index.
//  *
//  * @param date contains information about the date
//  * (excluding the time of day)
//  */
// export const createNonConflictingTime = (
//     date: Date,
//     leftIndex: number,
//     numChunks: number,
//     additionToIndex: number,
//     chunksInHour: number,
//     startingHour: number
//   ): SuggestedTime => {
//     const start =  moment(date)
//       .hour((leftIndex - additionToIndex) / chunksInHour + startingHour)
//       .minute(additionToIndex * 30);
  
//       const end =  moment(date)
//       .hour((leftIndex + numChunks - additionToIndex) / chunksInHour + startingHour)
//       .minute(additionToIndex * 30);
  
//       return {start, end};
//   };
  

describe("createNonConflictingTime Tests", () => {

    const date = eventsOfTheDay[0].start_time;
    const chunksInHour = 2; // 30 second intervals 
    const startingHour = 8; // start at 8am 

    it("create time chunk on half hour", () => {
      const suggestedTime = createNonConflictingTime(
          date, 5, 4, 1, chunksInHour, startingHour
      );

      console.log(suggestedTime);
      // 10:30 - 12:30
    });

    it("create time chunk not on half hour", () => {
        const suggestedTime = createNonConflictingTime(
            date, 0, 1, 0, chunksInHour, startingHour
        );
  
        console.log(suggestedTime); // Should be 8 - 8:30 (didnt work)
      });

    it("create time chunk on half hour", () => {
    const suggestedTime = createNonConflictingTime(
        date, 0, 1, 1, chunksInHour, startingHour
    );

    console.log(suggestedTime); // Should be 8 - 8:30 (didnt work)
    });


  });
  