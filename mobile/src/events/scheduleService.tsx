import Pod from "../types/Pod";
import apiUrl from "../config";
import * as SecureStore from "expo-secure-store";

/**
 * scheduleService contains requests to the
 * backend for the schedule and schedule sub
 * components.
 */

export const fetchUserPod = async (): Promise<Pod | undefined> => {
  try {
    const authToken = await SecureStore.getItemAsync("wigo-auth-token");
    const res = await fetch(`${apiUrl}/pods/currUsersPod`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
    });
    const json = await res.json();
    const returnedPod = json.pod;
    return returnedPod;
  } catch (err) {
    console.log("ERROR: ", err);
    console.log("error loading pod for current user");
    return undefined;
  }
};

function compareEvents(eventA, eventB) {
  if (eventA.start_time < eventB.start_time) {
    return -1;
  } else if (eventA.start_time > eventB.start_time) {
    return 1;
  }
  return 0;
}

export const fetchPodEvents = async (podId: number) => {
  try {
    const authToken = await SecureStore.getItemAsync("wigo-auth-token");
    const res = await fetch(`${apiUrl}/events/${podId}`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
    });

    const json = await res.json();
    const sortedEvents = json.events.sort(compareEvents);
    const returnedEvents = sortedEvents;

    return returnedEvents;
  } catch (err) {
    console.log("ERROR: ", err);
    console.log("error loading events for current pod");
  }
};

export const fetchUserEvents = async () => {
  try {
    const authToken = await SecureStore.getItemAsync("wigo-auth-token");
    const res = await fetch(`${apiUrl}/events`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
    });
    const json = await res.json();
    const returnedEvents = json.events;

    return returnedEvents;
  } catch (err) {
    console.log("ERROR in fetchUserEvents: ", err);
    console.log("error loading events for current user");
  }
};

export const fetchAvatarsAndEmails = async (ids: number[]) => {
  try {
    const authToken = await SecureStore.getItemAsync("wigo-auth-token");
    const res = await fetch(`${apiUrl}/users/avatars`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
      body: JSON.stringify(ids),
    });
    const json = await res.json();
    return json.map;
  } catch (err) {
    console.log("Error in fetchAvatorsAndEmails: ", err);
    console.log("error loading events for current user");
  }
};

export const fetchUserEmail = async (ownerId: number) => {
  try {
    const authToken = await SecureStore.getItemAsync("wigo-auth-token");
    const res = await fetch(`${apiUrl}/users/email/${ownerId}`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
    });
    const json = await res.json();
    return json.email;
  } catch (err) {
    console.log("ERROR: ", err);
    console.log("error loading events for current user");
  }
};
