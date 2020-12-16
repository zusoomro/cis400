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

// export const loadUserEvents = createAsyncThunk(
//   "events/loadUserEvents",
//   async (
//     data,
//     api
//   ): Promise<Event[] | ReturnType<typeof api.rejectWithValue>> => {
//     try {
//       console.log("Adding to redux")
//       const authToken = (api.getState() as RootState).auth.token;
//       const res = await fetch(`${apiUrl}/events`, {
//         headers: {
//           "Content-Type": "application/json;charset=utf-8",
//           "x-auth-token": authToken,
//         },
//       });

//       const json = await res.json();

//       if (!res.ok) {
//         return api.rejectWithValue(json.message);
//       }

//       return json.events;
//     } catch (err) {
//       return api.rejectWithValue(err.message);
//     }
//   }
// );

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents(state, action) {
      console.log("reduxing events")
      // state.events = [action.payload];

      // state.events = [...state.events, action.payload]

      state.events = [...state.events.filter(event => event.id != action.payload.id), action.payload]
    },
  },
});

export const { setEvents } = eventSlice.actions;
export default eventSlice.reducer;
