import Event from "../types/Event";
import apiUrl from "../config";
import * as SecureStore from "expo-secure-store";
import analytics from "../analytics/analytics";

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
      startFormattedAddress: values.startFormattedAddress,
      startLat: values.startLng,
      startLng: values.startLng,
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
    analytics.track("User entered conflicting event");
    return conflicts;
  } catch (error) {
    console.log("error proposing new event", error);
    return null;
  }
};

export const createEventOnSubmit = async (
  values: Event
): Promise<Event | null> => {
  // Create event to be put in database
  const data = {
    name: values.name,
    formattedAddress: values.formattedAddress,
    lat: values.lat,
    lng: values.lng,
    startFormattedAddress: values.startFormattedAddress,
    startLat: values.startLat,
    startLng: values.startLng,
    start_time: values.start_time,
    end_time: values.end_time,
    repeat: values.repeat,
    notes: values.notes,
    priority: values.priority,
  };

  try {
    const res = await fetch(`${apiUrl}/events`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": (await SecureStore.getItemAsync(
          "wigo-auth-token"
        )) as string,
      }),
      body: JSON.stringify(data),
    });

    const event = await res.json();

    if (!res.ok) {
      console.log("Event creation rejected by backend");
      console.log("Event:", event);
      throw new Error("Event creation rejected by backend");
    }
    analytics.track("Event created");
    return event.event;
  } catch (error) {
    console.log(`error creating new event`, error);
    return null;
  }
};

export const modifyEventOnSubmit = async (
  values: Event
): Promise<Event | null> => {
  // Create event to be put in database
  const data = {
    name: values.name,
    formattedAddress: values.formattedAddress,
    lat: values.lat,
    lng: values.lng,
    startFormattedAddress: values.startFormattedAddress,
    startLat: values.startLat,
    startLng: values.startLng,
    start_time: values.start_time,
    end_time: values.end_time,
    repeat: values.repeat,
    notes: values.notes,
    id: values.id,
    priority: values.priority,
  };
  try {
    const res = await fetch(`${apiUrl}/events`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": (await SecureStore.getItemAsync(
          "wigo-auth-token"
        )) as string,
      },
      body: JSON.stringify(data),
    });

    const event = await res.json();

    if (!res.ok) {
      console.log("Event creation rejected by backend");
      console.log("Event:", event);
      throw new Error("Event modification rejected by backend");
    }
    analytics.track("Event modified");
    return event;
  } catch (error) {
    console.log(`error updatind event`, error);
    return null;
  }
};

export const handleDeleteEvent = async (
  values: Event
): Promise<Event | null> => {
  const data = { id: values.id };
  try {
    const res = await fetch(`${apiUrl}/events`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": (await SecureStore.getItemAsync(
          "wigo-auth-token"
        )) as string,
      },
      body: JSON.stringify(data),
    });
    console.log("event deleted");
    analytics.track("Event deleted");
    return await res.json();
  } catch (error) {
    console.log(`error deleting event`, error);
    return null;
  }
};
