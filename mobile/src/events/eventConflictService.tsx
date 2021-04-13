import Event from "../types/Event";
import apiUrl from "../config";
import * as SecureStore from "expo-secure-store";
import { findSuggestedTimes } from "./suggestedTimes/suggestedTimesFunctions";

export interface ConflictBuffer {
  otherEventId: number;
  availableTime: number;
  travelTime: number;
}

export interface ProposedEventConflicts {
  isConflicting: boolean;
  conflictingEvents: Event[];
  conflictingBuffers: ConflictBuffer[];
}

export type SuggestedTime = {
  start: moment.Moment; // 0-24 for hour of the day
  end: moment.Moment; // 1 if rounded event starts on half hour, 0 otherwise
};

export const proposeEvent = async (
  values: Event,
  podId: number,
  existingEvent: Event | null
): Promise<ProposedEventConflicts | null> => {
  const data = {
    podId: podId,
    event: {
      id: existingEvent ? existingEvent.id : null,
      name: values.name,
      formattedAddress: values.formattedAddress,
      lat: values.lat,
      lng: values.lng,
      start_time: values.start_time,
      end_time: values.end_time,
      repeat: values.repeat,
      notes: values.notes,
    },
  };

  try {
    const res = await fetch(`${apiUrl}/events/proposeEvent`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": (await SecureStore.getItemAsync(
          "wigo-auth-token"
        )) as string,
      }),
      body: JSON.stringify(data),
    });

    const conflicts: ProposedEventConflicts = await res.json();

    if (!res.ok) {
      console.log("Event proposal rejected by backend");
      console.log("Conflicts", conflicts);
      throw new Error("Event proposal rejected by backend");
    }

    return conflicts;
  } catch (error) {
    console.log("error proposing new event", error);
    return null;
  }
};

// Find alternative times for suggested event
export const getSuggestedTimes = async (
  proposedEvent: Event,
  podId: number,
  existingEvent: Event | null
): Promise<SuggestedTime[]> => {
  const data = {
    podId: podId,
    date: proposedEvent.start_time,
  };

  try {
    const res = await fetch(`${apiUrl}/pods/getPodEventsOfDay`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": (await SecureStore.getItemAsync(
          "wigo-auth-token"
        )) as string,
      }),
      body: JSON.stringify(data),
    });

    // Determine if there are any immediately conflicting events
    const response = await res.json();
    console.log("respone", response);
    let eventsOfTheDay: Event[] = response.eventsOfDay;

    // Filter out current event if it exists
    if (existingEvent) {
      eventsOfTheDay = eventsOfTheDay.filter(
        (eventItem) => eventItem.id != existingEvent.id
      );
    }

    const suggestedTimes: SuggestedTime[] = findSuggestedTimes(
      proposedEvent,
      eventsOfTheDay,
      4
    );
    return suggestedTimes;
  } catch (error) {
    console.log("error with getting suggested times", error);
    return [];
  }
};
