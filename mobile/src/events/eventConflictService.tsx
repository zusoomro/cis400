import Event from "../types/Event";
import apiUrl from "../config";
import * as SecureStore from "expo-secure-store";

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

export interface SuggestedTimes {
  nonConflictingTimes: SuggestedTime[];
}

export type SuggestedTime = {
  start: moment.Moment; // 0-24 for hour of the day
  end: moment.Moment; // 1 if rounded event starts on half hour, 0 otherwise
};

export const proposeEvent = async (
  values: Event,
  podId: number,
  existingEvent: Event
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
  
export const getSuggestedTimes = async (
  proposedEvent: Event,
  podId: number,
  existingEvent: Event
): Promise<SuggestedTime[]> => {
  const data = {
    podId: podId,
    event: {
      id: existingEvent ? existingEvent.id : null,
      name: proposedEvent.name,
      formattedAddress: proposedEvent.formattedAddress,
      lat: proposedEvent.lat,
      lng: proposedEvent.lng,
      startFormattedAddress: proposedEvent.startFormattedAddress,
      startLat: proposedEvent.startLng,
      startLng: proposedEvent.startLng,
      start_time: proposedEvent.start_time,
      end_time: proposedEvent.end_time,
      repeat: proposedEvent.repeat,
      notes: proposedEvent.notes,
    },
  };

  try {
    const res = await fetch(`${apiUrl}/events/getSuggestedTimes`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": (await SecureStore.getItemAsync(
          "wigo-auth-token"
        )) as string,
      }),
      body: JSON.stringify(data),
    });

    const suggestedTimes: SuggestedTimes = await res.json();
    return suggestedTimes.nonConflictingTimes;
  } catch (error) {
    console.log("error with getting suggested times", error);
    return [];
  }
};
