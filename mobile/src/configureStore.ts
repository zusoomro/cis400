import { configureStore, combineReducers } from "@reduxjs/toolkit";
import auth from "./authSlice";
import pods from "./pods/podSlice";

const rootReducer = combineReducers({
  auth,
  pods,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
