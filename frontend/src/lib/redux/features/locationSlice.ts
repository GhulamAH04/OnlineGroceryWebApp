import { ILocation } from "@/interfaces/location.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {city: string} = {
  city: ""
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCity: (state: {city: string}, action: PayloadAction<ILocation>) => {
      state.city = action.payload.city;
    },
  },
});

export const { setCity } = locationSlice.actions;

export default locationSlice.reducer;
