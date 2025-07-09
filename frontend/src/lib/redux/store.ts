import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./features/authSlice";
import locationReducer from "./features/locationSlice"
import addressReducer from "./features/addressSlice"

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authSlice,
      location: locationReducer,
      address: addressReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
