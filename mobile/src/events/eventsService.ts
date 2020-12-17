import Event from "../types/Event";
import apiUrl from "../config";
import * as SecureStore from "expo-secure-store";
import * as Yup from "yup";

export const validateEventSchema = () => {
  return Yup.object().shape({
    name: Yup.string().required("Name required"),
    formattedAddress: Yup.string().required("Location Required"),
    // Make sure end_time > start_time
    start_time: Yup.date().required(),
    end_time: Yup.date().min(
      Yup.ref("start_time"),
      "End time needs to be after start time"
    ),
  });
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
    console.log(event);

    if (!res.ok) {
      console.log("Event creation rejected by backend");
      console.log("Event:", event);
      throw new Error("Event creation rejected by backend");
    }
    return event;
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
