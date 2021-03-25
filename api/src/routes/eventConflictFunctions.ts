import moment from "moment";
import fetch from "node-fetch";
import Event from "../../models/Event";

export type ConflictBuffer = {
  otherEventId: number;
  availableTime: number;
  travelTime: number;
};

class Endpoint {
  time: Date;
  event: Event;

  constructor(time: Date, event: Event) {
    this.time = time;
    this.event = event;
  }
}

/*
 A function which determines if the travel time between any of the input events would cause them to be impossible to attend sequentially

 @param proposedEvent - the middle event
 @param previousEvent - the previous event
 @param nextEvent - the event after the proposed event

 @returns {
    isConflicting - a boolean which represents if the events would be possible
    to attend

    conflictingEvents - the events which conflict with the proposed
    event

    conflictingBuffers - a list of buffers describing the travel time
    conflicts
 }
 */
export const determineTravelTimeConflicts = async (
  proposedEvent: Event,
  previousEvent: Event | undefined,
  nextEvent: Event | undefined
): Promise<{
  conflictingEvents: Event[];
  conflictingBuffers: ConflictBuffer[];
  isConflicting: boolean;
}> => {
  const conflictingEvents: Event[] = [];
  const conflictingBuffers: ConflictBuffer[] = [];

  // Travel time is in minutes
  if (previousEvent) {
    const firstTravelTime = await getTravelTime(previousEvent, proposedEvent);
    var diffMinutes = Math.abs(
      moment(previousEvent.end_time).diff(proposedEvent.start_time, "minutes")
    );
    if (firstTravelTime >= diffMinutes) {
      conflictingEvents.push(previousEvent);
      conflictingBuffers.push({
        otherEventId: previousEvent.id,
        availableTime: diffMinutes,
        travelTime: firstTravelTime,
      });
    }
  }

  // Travel time is in minutes
  if (nextEvent) {
    const secondTravelTime = await getTravelTime(proposedEvent, nextEvent);
    var diffMinutes = Math.abs(
      moment(nextEvent.start_time).diff(proposedEvent.end_time, "minutes")
    );
    if (secondTravelTime >= diffMinutes) {
      conflictingEvents.push(nextEvent);
      conflictingBuffers.push({
        otherEventId: nextEvent.id,
        availableTime: diffMinutes,
        travelTime: secondTravelTime,
      });
    }
  }

  return {
    isConflicting: conflictingEvents.length ? true : false,
    conflictingEvents,
    conflictingBuffers,
  };
};

/*
 Retrieves the previous and next event for the proposed event. Assumes that
 there are no existing events that overlap with the proposed event.

 @param proposedEvent - The proposed event
 @param events - the list of existing
 events that we want to get the previous and next event out of

 @returns { previousEvent, nextEvent } - an Object containing two events - the
 previous event to the proposed event and the next event for the proposed event
*/
export const getPreviousAndNextEvent = (
  proposedEvent: Event,
  events: Event[]
) => {
  let previousEvent: Event | undefined = undefined;
  let nextEvent: Event | undefined = undefined;

  for (const event of events) {
    if (
      event.end_time <= proposedEvent.start_time &&
      (previousEvent == undefined || event.end_time >= previousEvent.end_time)
    ) {
      previousEvent = event;
    } else if (
      event.start_time >= proposedEvent.end_time &&
      (nextEvent == undefined || event.start_time <= nextEvent.start_time)
    ) {
      nextEvent = event;
    }
  }

  return { previousEvent, nextEvent };
};

/*
  Return the travel time in minutes between two events.

  @param firstEvent - The chronologically first event
  @param secondEvent - The chronologically second event

  @returns travelTime - the travel time between the two events in minutes
 */
export const getTravelTime = async (
  firstEvent: Event,
  secondEvent: Event
): Promise<number> => {
  const res = await fetch(
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
              lat: firstEvent.lat,
              lng: firstEvent.lng,
            },
          },
          {
            latLng: {
              lat: secondEvent.lat,
              lng: secondEvent.lng,
            },
          },
        ],
      }),
    }
  );

  const json = await res.json();

  // route.realTime is in seconds, convert it to minutes
  const travelTime = json.route.time / 60;
  return travelTime;
};

/*
 Returns events in the existing events array that overlap with the proposed
 event.

 @param proposedEvent - the event that you would like to compare to the other
 events @param existingEvents - the existing events in the schedule that might
 conflict with the proposed event

 @returns conflictingEvents - an array of events that conflict
*/
export const getOverlappingEvents = (
  proposedEvent: Event,
  existingEvents: Event[]
): Event[] => {
  // NOTE: event 'start_time' and 'end_time' are actually strings on dev
  // but actually dates on development
  const endpointTimes: Endpoint[] = [];
  const eventsAdded = new Set();
  const conflictingEvents = [];

  // Checking if proposed event exists inside any existing events
  existingEvents.forEach((event) => {
    // Can compare events this way as both will always be the same type
    if (
      event.start_time <= proposedEvent.start_time &&
      event.end_time >= proposedEvent.end_time
    ) {
      conflictingEvents.push(event);
    }
    endpointTimes.push(new Endpoint(new Date(event.start_time), event));
    endpointTimes.push(new Endpoint(new Date(event.end_time), event));
  });

  // Seeing if any end point is in between the proposed start and end time
  for (const endpoint of endpointTimes) {
    if (
      endpoint.time >= new Date(proposedEvent.start_time) &&
      endpoint.time <= new Date(proposedEvent.end_time) &&
      !eventsAdded.has(endpoint.event.id)
    ) {
      conflictingEvents.push(endpoint.event);
      eventsAdded.add(endpoint.event.id);
    }
  }

  return conflictingEvents;
};
