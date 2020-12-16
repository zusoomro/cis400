import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import apiUrl from "../config";
import * as RootNavigation from "../rootNavigation";
import Event from "../types/Event";
import * as SecureStore from "expo-secure-store";
import { useRef } from "react";

export const setupNotificationListeners = async (
  notificationListener,
  responseListener
) => {
  // This listener is fired whenever a notification is received while the app is foregrounded
  notificationListener.current = Notifications.addNotificationReceivedListener(
    (notification) => {
      // console.log("We received a notification with this data", notification);
    }
  );

  // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  responseListener.current = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      RootNavigation.navigate("ModifyEvent", { eventId: 1 });
      //       console.log(response);
    }
  );
};

export const registerForPushNotificationsAsync = async () => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return "";
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    return "";
  }
  return token;
};

export const generateAndUploadPushNotificationToken = async () => {
  const token = await registerForPushNotificationsAsync();

  console.log("getting to this point.");

  const url = apiUrl + "/notifications/token";

  console.log("url", url);

  console.log("got to outside the try block");
  console.log("got to right before the fetch request");

  console.log("token", token);

  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json;charset=utf-8",
      "x-auth-token": (await SecureStore.getItemAsync(
        "wigo-auth-token"
      )) as string,
    }),
    body: JSON.stringify({ token }),
  });

  console.log("res");
  console.log(res);
  console.log("hello ");
};

interface Props {
  recipientId: number;
  eventId: number;
}

export const sendPushNotification = async ({ recipientId, eventId }: Props) => {
  try {
    console.log("sending push notification");
    const res = await fetch(apiUrl + "/notifications/message", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": (await SecureStore.getItemAsync(
          "wigo-auth-token"
        )) as string,
      }),
      body: JSON.stringify({ recipientId, eventId }),
    });

    if (!res.ok) {
      console.error("the res is not ok");
    }
    console.log("whats up");
    console.log("res", { message: "hello" });
    console.log("res", res);
  } catch (err) {
    console.log("whats up, im here");
    console.error("Error sending push notification", err);
  }
};

export const deletePushNotificationToken = async () => {
  try {
    console.log("deleting push notification token");
    const res = await fetch(apiUrl + "/notifications/token", {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": (await SecureStore.getItemAsync(
          "wigo-auth-token"
        )) as string,
      }),
    });

    if (!res.ok) {
      console.error("the res is not ok");
    }
  } catch (err) {
    console.error("Error sending push notification", err);
  }
};
