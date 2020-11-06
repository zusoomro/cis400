import { configureStore, combineReducers } from "@reduxjs/toolkit";
import auth from "./authSlice";

const rootReducer = combineReducers({
  auth,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
