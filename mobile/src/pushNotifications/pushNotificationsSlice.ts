import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  token: '',
  notification: false as boolean | Notification
};

const pushSlice = createSlice({
  name: "push",
  initialState,
  reducers: {
    setPushToken(state, action) {
      state.token = action.payload as string;
    },
  },
});

export const { setPushToken } = pushSlice.actions
export default pushSlice.reducer;
