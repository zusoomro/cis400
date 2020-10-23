import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = "http://localhost:8000";

const initialState = {
  authenticated: true,
  token: "",
  user: {},
  loading: true,
  error: {},
};

export const register = createAsyncThunk("auth/signUp", async (data, api) => {
  try {
    const res = await fetch(apiUrl + "/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    });

    const token = await res.json();

    console.log("token", token);

    return token;
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

    // Fulfilled
    [register.fulfilled]: (state, action) => {
      state.token = action.payload.token;
      state.authenticated = true;
      state.loading = false;
    },

    // Rejected
    [register.rejected]: (state, action) => {
      state.authenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default authSlice.reducer;
