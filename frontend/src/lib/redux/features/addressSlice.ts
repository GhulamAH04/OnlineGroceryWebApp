import { IAddress } from "@/interfaces/address.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state based on the IAddress interface
const initialState: IAddress = {
  id: 0,
  name: "",
  address: "",
  provinces: { id: 0, name: "" },
  cities: { id: 0, name: "", provinceId: 0 },
  postalCode: "",
  isPrimary: false,
  userId: 0,
  latitude: 0,
  longitude: 0,
};

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<Partial<IAddress>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setAddress } = addressSlice.actions;

export default addressSlice.reducer;
