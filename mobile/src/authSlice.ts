import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";
import { TextInput } from "react-native";
import React from "react";
import apiUrl from "./config";

const initialState = {
  authenticated: true,
  token: "",
  user: {},
  loading: true,
  error: {},
  apiKey: "",
};

export const loadUser = createAsyncThunk("auth/loadUser", async (data, api) => {
  try {
    const res = await fetch(apiUrl + "/users/loadUser", {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "x-auth-token": await SecureStore.getItemAsync("wigo-auth-token"),
      },
    });

    const json = await res.json();

    console.log(res);

    if (!res.ok) {
      return api.rejectWithValue(json.message);
    }

    return json;
  } catch (ex) {
    console.log(`error loading user`, ex);
    return api.rejectWithValue(ex.message);
  }
});

export const logOut = createAsyncThunk(
  "auth/logout",
  async (data, api): Promise<string> => {
    try {
      await SecureStore.deleteItemAsync("wigo-auth-token");
      return {};
    } catch (ex) {
      console.error(`error in logout`, ex);
    }
  }
);

export const loadToken = createAsyncThunk(
  "users/loadToken",
  async (data, api) => {
    const token = await SecureStore.getItemAsync("wigo-auth-token");

    if (token) {
      return token;
    } else {
      throw new Error("The token was not found");
    }
  }
);

export const login = createAsyncThunk("auth/login", async (data, api) => {
  try {
    console.log("apiUrl", apiUrl);
    const res = await fetch(apiUrl + "/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    });

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginValues, api) => {
    try {
      const res = await fetch(apiUrl + "/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(data),
      });

      console.log("res", res);

    if (!res.ok) {
      return api.rejectWithValue(json.message);
    }

    await SecureStore.setItemAsync("wigo-auth-token", json.token);

      await SecureStore.setItemAsync("wigo-auth-token", json.token);

      return json;
    } catch (ex) {
      console.log(`error creating new user`, ex);
      return api.rejectWithValue(ex.message);
    }
  }
);

export const getApiKey = createAsyncThunk(
  "auth/getApiKey",
  async (data, api) => {
    try {
      const res = await fetch(apiUrl + "/events/apiKey", {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "x-auth-token": await SecureStore.getItemAsync("wigo-auth-token"),
        },
      });

      const json = await res.json();

      if (!res.ok) {
        return api.rejectWithValue(json.message);
      }

      return json.key;
    } catch (ex) {
      console.log(`error creating api key`, ex);
      return api.rejectWithValue(ex.message);
    }
  }
);

export const register = createAsyncThunk("auth/register", async (data, api) => {
  try {
    const res = await fetch(apiUrl + "/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      return api.rejectWithValue(json.message);
    }

    await SecureStore.setItemAsync("wigo-auth-token", json.token);

    console.log("json", json);

    return json;
  } catch (ex) {
    console.log(`error creating new user`, ex);
    return api.rejectWithValue(ex.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    // Pending ( I wish there was a way to combine all of these)
    [register.pending]: (state, action) => {
      state.loading = true;
    },
    [login.pending]: (state, action) => {
      state.loading = true;
    },
    [loadUser.pending]: (state, action) => {
      state.loading = true;
    },
    [loadToken.pending]: (state, action) => {
      state.loading = true;
    },
    [logOut.pending]: (state, action) => {
      state.loading = true;
    },
    [getApiKey.pending]: (state, action) => {
      state.loading = true;
    },

    // Fulfilled
    [register.fulfilled]: (state, action) => {
      console.log("updating store");
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.authenticated = true;
      state.loading = false;
    },
    [login.fulfilled]: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.authenticated = true;
      state.loading = false;
    },
    [loadUser.fulfilled]: (state, action) => {
      state.user = action.payload.user;
      state.authenticated = true;
      state.loading = false;
    },
    [loadToken.fulfilled]: (state, action) => {
      state.token = action.payload;
      state.loading = false;
    },
    [logOut.fulfilled]: (state, action) => {
      state.token = "";
      state.user = {};
      state.authenticated = false;
      state.loading = false;
    },
    [getApiKey.fulfilled]: (state, action) => {
      state.apiKey = action.payload;
      state.loading = false;
    },

    // Rejected
    [register.rejected]: (state, action) => {
      state.authenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    [login.rejected]: (state, action) => {
      state.authenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    [loadToken.rejected]: (state, action) => {
      state.authenticated = false;
      state.token = "";
      state.loading = false;
      state.error = action.payload;
    },
    [getApiKey.rejected]: (state, action) => {
      state.apiKey = "";
      state.loading = false;
      state.error = action.payload;
    },
    [loadUser.rejected]: (state, action) => {
      state.authenticated = false;
      state.user = {};
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default authSlice.reducer;
