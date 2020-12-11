import { configureStore, combineReducers } from "@reduxjs/toolkit";
import auth from "./authSlice";
import pods from "./pods/podSlice";
import push from './pushNotifications/pushNotificationsSlice'

const rootReducer = combineReducers({
  auth,
  pods,
  push,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
