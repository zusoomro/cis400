import Event from "../../models/Event";
import moment from "moment";

type RoundedEvent = {
  originalEvent: Event;

  roundedStartHour: number; // 0-24 for hour of the day
  startOnHalfHour: boolean; // 1 if rounded event starts on half hour, 0 otherwise
  roundedEndHour: number; // 0-24 for hour of the day
  endOnHalfHour: boolean; // 0 if rounded event end on half hour
};

export type SuggestedTime = {
  start: moment.Moment; // 0-24 for hour of the day
  end: moment.Moment; // 1 if rounded event starts on half hour, 0 otherwise
};


/**
 * getRoundedEvents transforms each event into a Rounded Event.
 * The start time of the event is rounded DOWN to the nearest half hour chunk.
 * The end of time of the event is rounded UP to the neart half hour chunk.
 *
 * @param eventsOfTheDay - events to be rounded
 * @returns array where each event is rounded
 */
export const getRoundedEvents = (eventsOfTheDay: Event[]): RoundedEvent[] => {
  // Round events to nearest half hour blocks
  const roundedEvents = eventsOfTheDay.map((event) => {
    const start_time = moment(event.start_time);
    const end_time = moment(event.end_time);

    // RIGHT NOW - the idea of the half hour is baked into the algorithm, but can
    // be changed in the future.
    const endOnHalfHour = end_time.minutes() <= 30; // Round up if end time is over 30 min

    return {
      originalEvent: event,
      roundedStartHour: start_time.hour(),
      startOnHalfHour: start_time.minutes() >= 30, // Round down to half hour mark over 30
      //  If it does NOT end on the half half, the hour was rounded up unless the minute was already 0
      roundedEndHour:
        end_time.hour() + (!endOnHalfHour && end_time.minutes() != 0 ? 1 : 0),
      endOnHalfHour: endOnHalfHour,
    };
  });

  return roundedEvents;
};

/**
 * getBusyTimesArray creates a boolean array where each index
 * represents a 'chunk' of the day and is true if the pod is busy and false
 * otherwise.
 *
 * @param roundedEvents - events in the pod of the day
 * @param chunksInHour - number of 'buys/free' chunks to consider in an hour
 *  for example if chunksInHour = 2, each index in the array represents 30 minutes
 * @param startingHour - The first hour of the day for the pod, the returned arra
 * will start at this hour. This is to adjust towards whenever a pod starts their day.
 *
 * @returns boolean[] that indicates which chunks of the day are free and which
 * chunks of the day are busy.
 */
export const getBusyTimesArray = (
  roundedEvents: RoundedEvent[],
  chunksInHour: number,
  startingHour: number
): boolean[] => {
  let busyTimes: boolean[] = [];
  roundedEvents.forEach((e) => {
    const startIndex =
      (e.roundedStartHour - startingHour) * chunksInHour +
      (e.startOnHalfHour ? 1 : 0);
    const endIndex =
      (e.roundedEndHour - startingHour) * chunksInHour +
      (e.endOnHalfHour ? 1 : 0);

    // This is inefficient and can be refactored if too slow
    // Event runs up until the endIndex
    for (let index = startIndex; index < endIndex; index++) {
      busyTimes[index] = true;
    }
  });

  return busyTimes;
};

/** isIntervalFree Checks if interval is free
 * given startingIndex and the size of the interval
 */
export const isIntervalFree = (
  busyTimes: boolean[],
  startingIndex: number,
  sizeOfInterval: number
): boolean => {
  let allFree = true;
  for (let i = startingIndex; i < startingIndex + sizeOfInterval; i++) {
    if (busyTimes[i]) {
      allFree = false;
      break;
    }
  }
  return allFree;
};

/**
 * CreateNonConflictingTime creates the moment
 * that does not conflict with existing events
 * based on the size of the interval and current
 * index.
 *
 * @param date contains information about the date
 * (excluding the time of day)
 */
export const createNonConflictingTime = (
  date: Date,
  leftIndex: number,
  numChunks: number,
  additionToIndex: number, // Whether date starts on half hour or not
  chunksInHour: number,
  startingHour: number
): SuggestedTime => {
  const start =  moment(date)
    .hour((leftIndex - additionToIndex) / chunksInHour + startingHour)
    .minute(additionToIndex * 30);

    const end =  moment(date)
    .hour((leftIndex + numChunks - additionToIndex) / chunksInHour + startingHour)
    .minute(additionToIndex * 30);

    return {start, end};
};

export const findSuggestedTimes = async (
  proposedEvent: Event,
  eventsOfTheDay: Event[],
  numTimesToReturn: number
): Promise<{
  nonConflictingTimes: SuggestedTime[];
}> => {
  const nonConflictingTimes: SuggestedTime[] = [];
  // TO DO LATER (NOT INCLUDED FOR NOW BECAUSE THE DATA ISNT THERE -- start and end places)
  // Determine buffers time for each event --

  const roundedEvents = getRoundedEvents(eventsOfTheDay);

  // Populate busy times array -- FOR NOW. Assume 20 index array 8am-6pm
  const chunksInHour = 2; // Each are 30 minutes
  const startingHour = 8; // Start at 8am
  const endingHour = 12 + 6; // 6pm

  let busyTimes: boolean[] = getBusyTimesArray(
    roundedEvents,
    chunksInHour,
    startingHour
  );

  // Find all free times in the busy array
  const roundedEvent = getRoundedEvents([proposedEvent])[0];
  const additionToIndex = roundedEvent.startOnHalfHour ? 1 : 0;
  const startingIndexOfProposedEvent =
    (roundedEvent.roundedStartHour - startingHour) * chunksInHour +
    additionToIndex;

  let leftIndex = startingIndexOfProposedEvent - 1;
  let rightIndex = startingIndexOfProposedEvent + 1;
  const numChunks = rightIndex - leftIndex + 1;

  // Starting from original index of event, move to the left
  // and right to find free times until all chunks are found
  // or the numTimesToReturn is found
  while (
    nonConflictingTimes.length < numTimesToReturn &&
    (leftIndex >= 0 || rightIndex + numChunks < endingHour)
  ) {
    if (leftIndex >= 0) {
      let allFree = isIntervalFree(busyTimes, leftIndex, numChunks);

      if (allFree) {
        const nonConflictingTime = createNonConflictingTime(
          proposedEvent.start_time,
          leftIndex,
          numChunks,
          additionToIndex,
          chunksInHour,
          startingHour
        );
        nonConflictingTimes.push(nonConflictingTime);
      }
      leftIndex--;
    }

    if (
      rightIndex + numChunks < endingHour &&
      nonConflictingTimes.length < numTimesToReturn
    ) {
      let allFree = isIntervalFree(busyTimes, rightIndex, numChunks);

      if (allFree) {
        const nonConflictingTime = createNonConflictingTime(
          proposedEvent.start_time,
          rightIndex,
          numChunks,
          additionToIndex,
          chunksInHour,
          startingHour
        );
        nonConflictingTimes.push(nonConflictingTime);
      }
      rightIndex++;
    }
  }

  return {
    nonConflictingTimes,
  };
};
