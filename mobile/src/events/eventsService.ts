import Event from "../types/Event";
import apiUrl from "../config";
import * as SecureStore from "expo-secure-store";
import * as Yup from "yup";

export const validateEventSchema = () => {
  return Yup.object().shape({
    name: Yup.string().required("Name required"),
    formattedAddress: Yup.string().required("Destination location Required"),
    startFormattedAddress: Yup.string().required("Start location Required"),
    // Make sure end_time > start_time
    start_time: Yup.date().required(),
    end_time: Yup.date().min(
      Yup.ref("start_time"),
      "End time needs to be after start time"
    ),
  });
};

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

export interface SuggestedTime {
  start: moment.Moment; // 0-24 for hour of the day
  end: moment.Moment; // 1 if rounded event starts on half hour, 0 otherwise
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
    const res = await fetch(`http://localhost:8000/events`, {
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
    return await res.json();
  } catch (error) {
    console.log(`error deleting event`, error);
    return null;
  }
};

export const suggestedTimes = async (
  proposedEvent: Event,
  podId: number,
  existingEvent: Event
): Promise<SuggestedTime[] | null> => {
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

    const suggestedTimes: SuggestedTime[] = await res.json();

    return suggestedTimes;
  } catch (error) {
    console.log("error proposing new event", error);
    return null;
  }
};
