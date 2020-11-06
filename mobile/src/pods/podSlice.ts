import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SecureStore } from "expo/build/removed.web";
import React from "react";
import { RootState } from "../configureStore";
import Pod from "../../../api/models/Pod";

let apiUrl: string;

if (__DEV__) {
  apiUrl = "http://localhost:8000";
} else {
  apiUrl = "http://wigo-api.herokuapp.com";
}

const initialState: {
  pods: Pod[];
  loading: boolean;
  error: string;
} = {
  pods: [],
  loading: true,
  error: "",
};

export const loadUserPods = createAsyncThunk(
  "pods/loadUserPods",
  async (
    data,
    api
  ): Promise<Pod[] | ReturnType<typeof api.rejectWithValue>> => {
    try {
      const authToken = (api.getState() as RootState).auth.token;
      const res = await fetch("http://localhost:8000/pods/currUsersPod", {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "x-auth-token": authToken,
        },
      });

      const json = await res.json();
      return json.pod;
    } catch (err) {
      return api.rejectWithValue(err.message);
    }
  }
);

const podSlice = createSlice({
  name: "pods",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadUserPods.pending, (state, action) => {
      state.loading = true;
    });

    // Fulfilled
    builder.addCase(loadUserPods.fulfilled, (state, action) => {
      state.loading = false;
      state.pods = action.payload;
    });

    // Rejected
    builder.addCase(loadUserPods.rejected, (state, action) => {
      state.pods = [];
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default podSlice.reducer;
