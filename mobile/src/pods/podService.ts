import * as SecureStore from "expo-secure-store";
import analytics from "../analytics/analytics";
import apiUrl from "../config";

export const fetchUsersInvites = async () => {
  try {
    const authToken = await SecureStore.getItemAsync("wigo-auth-token");
    const res = await fetch(`${apiUrl}/invites`, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": authToken!,
      },
    });

    const json = await res.json();
    const invitesList = json.invites;
    if (invitesList.length) {
      console.log("fetched invites", invitesList);
      return invitesList;
    }
  } catch (err) {
    console.log("error loading invites for current user");
  }
};

export const handleRejectInvite = async (id: number) => {
  try {
    const res = await fetch(`${apiUrl}/invites/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(id),
    });
    const json = await res.json();
    if (json.message == "success") {
      analytics.track("User rejected invite");
      console.log("success rejecting invite");
    }
  } catch (err) {
    console.log(err);
  }
};

export const handleAcceptInvite = async (podId: number, inviteId: number) => {
  try {
    const res = await fetch(`${apiUrl}/invites/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": (await SecureStore.getItemAsync("wigo-auth-token"))!,
      },
      body: JSON.stringify({ podId, inviteId }),
    });
    const json = await res.json();
    analytics.track("User accepted invite");
    return json.pod;
  } catch (error) {
    console.log(`error accepting invite`, error);
  }
};
