import Event from '../types/Event'
import apiUrl from "../config";
import * as SecureStore from 'expo-secure-store'

export const createEventOnSubmit = async (values: Event): Promise<Event | null> => {
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

  console.log("Data for POST request", data);

  try {
    const res = await fetch(`${apiUrl}/events`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": await SecureStore.getItemAsync("wigo-auth-token") as string,
      }),
      body: JSON.stringify(data),
    });

    const event = await res.json();
    console.log("event after post request", event);
    return event;
  } catch (error) {
    console.log(`error creating new event`, error);
    return null;
  }
};

export const modifyEventOnSubmit = async (values: Event): Promise<Event | null> => {
  console.log("createEventOnSubmit");

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
    console.log("event after put request", event);
    return event;
  } catch (error) {
    console.log(`error updatind event`, error);
    return null;
  }
};

export const handleDeleteEvent = async (values: Event): Promise<Event | null> => {
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
