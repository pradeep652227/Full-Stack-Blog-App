import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../authSlice";
import postsReducer from "../postsSlice";
import { combineReducers } from "@reduxjs/toolkit";

const allReducers=combineReducers({
    
})
export const store=configureStore({
    reducer: {
        auth: authReducer,
        posts: postsReducer
      }
});