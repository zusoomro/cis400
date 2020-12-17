import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { SecureStore } from "expo/build/removed.web";
import React from "react";
import { RootState } from "../configureStore";
import Event from "../../../api/models/Event";

let apiUrl: string;

if (__DEV__) {
  apiUrl = "http://localhost:8000";
} else {
  apiUrl = "http://wigo-api.herokuapp.com";
}

const initialState: {
  events: Event[];
  loading: boolean;
  error: string;
} = {
  events: [],
  loading: true,
  error: "",
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents(state, action) {
      console.log(action.payload);
      state.events = [...action.payload];
    },
    changeEvent(state, action) {
      state.events = [
        ...state.events.filter((event) => event.id != action.payload.id),
        action.payload,
      ];
    },
    deleteEvent(state, action) {
      state.events = [
        ...state.events.filter((event) => event.id != action.payload.id),
      ];
    },
  },
});

export const { setEvents, changeEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
