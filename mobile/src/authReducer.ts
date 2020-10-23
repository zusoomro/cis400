import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = "http://localhost:8000";

const initialState = {
  authenticated: false,
  token: "",
  user: {},
  loading: true,
  error: {},
};

export const login = createAsyncThunk("auth/login", async (data, api) => {
  try {
    const res = await fetch(apiUrl + "/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    console.log("json", json);

    return json;
  } catch (ex) {
    console.log(`error creating new user`, ex);
    return api.rejectWithValue(ex.message);
  }
});

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

    // Fulfilled
    [register.fulfilled]: (state, action) => {
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
  },
});

export default authSlice.reducer;
