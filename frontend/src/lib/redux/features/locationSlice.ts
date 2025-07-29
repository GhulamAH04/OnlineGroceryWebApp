import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {city: string} = {
  city: "JAKARTA PUSAT"
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCity: (state: {city: string}, action: PayloadAction<{city: string}>) => {
      state.city = action.payload.city;
    },
  },
});

export const { setCity } = locationSlice.actions;

export default locationSlice.reducer;
