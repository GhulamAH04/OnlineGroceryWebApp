import { ILocation } from "@/interfaces/location.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ILocation = {
  latitude: 0,
  longitude: 0,
  city: ""
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCoordinates: (state: ILocation, action: PayloadAction<ILocation>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.city = "";
    },
    setCity: (state: ILocation, action: PayloadAction<ILocation>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.city = action.payload.city;
    },
  },
});

export const { setCoordinates, setCity } = locationSlice.actions;

export default locationSlice.reducer;
