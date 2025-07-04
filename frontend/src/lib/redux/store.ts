import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import locationReducer from "./features/locationSlice"

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authSlice,
      location: locationReducer
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
