import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn:false,
  userDetails: {},
};

const authSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    addDetails: (state, action) => {
      state.isLoggedIn=true;
      const obj = action.payload;
      state.userDetails = obj; //immutability is done by redux toolkit in the backend
    },
    clearDetails: (state) => {
      state.isLoggedIn=false;
      state.userDetails={};
    },
  },
});

export const { toggleIsLogged, addDetails, clearDetails } = authSlice.actions; //will be used in components
export default authSlice.reducer; //for store ; so that it can have knowledge of which reducer to handle
