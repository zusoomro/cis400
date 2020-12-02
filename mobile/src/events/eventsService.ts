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

  console.log("Creating event:", data);

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
      throw new Error("Event creation rejected by backend");
    }

    console.log("event after post request", event);
    return event;
  } catch (error) {
    console.log(`error creating new event`, error);
    return null;
  }
};

export const modifyEventOnSubmit = async (
  values: Event
): Promise<Event | null> => {
  console.log("modifyEventOnSubmit");

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

  console.log("Data for PUT request", data);

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
      throw new Error("Event modification rejected by backend");
    }

    console.log("event after put request", event);
    return event;
  } catch (error) {
    console.log(`error updatind event`, error);
    return null;
  }
};
