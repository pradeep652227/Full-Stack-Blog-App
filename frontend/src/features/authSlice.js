import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  userDetails: {},
};

const authSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    toggleIsLogged: (state) => {
      state.userDetails.isLoggedIn = !state.userDetails.isLoggedIn;
    },
    addDetails: (state, action) => {
      const obj = action.payload;
      state.userDetails = obj; //immutability is done by redux toolkit in the backend
    },
    clearDetails: (state) => {
      let user1 = state.userDetails;
      Object.keys(user1).map((key) => {
        if (key !== "isLoggedIn") state.userDetails[key] = "";
      });
      state.userDetails.isLoggedIn(false);
    },
  },
});

export const { toggleIsLogged, addDetails, clearDetails } = authSlice.actions; //will be used in components
export default authSlice.reducer; //for store ; so that it can have knowledge of which reducer to handle
