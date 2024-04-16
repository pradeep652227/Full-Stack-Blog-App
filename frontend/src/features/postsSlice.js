import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  imgURLPrefix:""
};

export const postsSlice = createSlice({
  name: "postsSlice",
  initialState,
  reducers: {
    addPosts: (state, action) => {
      state.posts=action.payload;
    },
    addImgURLPrefix:(state,action)=>{
      state.imgURLPrefix=action.payload;
    }
  },
});

export const { addPosts,addImgURLPrefix } = postsSlice.actions;

export default postsSlice.reducer;
