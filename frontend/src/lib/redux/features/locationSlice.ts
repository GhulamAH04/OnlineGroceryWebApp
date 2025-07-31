import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILocationState {
  city: string
}

const initialState: ILocationState = {
  city: "JAKARTA PUSAT"
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCity: (state: ILocationState, action: PayloadAction<ILocationState>) => {
      state.city = action.payload.city;
    },
  },
});

export const { setCity } = locationSlice.actions;

export default locationSlice.reducer;
