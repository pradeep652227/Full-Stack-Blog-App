import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  posts: []
};

export const postsSlice = createSlice({
  name: "postsSlice",
  initialState,
  reducers: {
    addPosts: (state, action) => {
      state.posts=action.payload;
    },
    clearPosts:(state)=>{
      state.posts=[];
    },
    clearPrivatePosts:(state)=>{
      state.posts=state.posts.filter(post=>post.userId === "");
    }
  },
});

export const { addPosts,clearPrivatePosts,clearPosts } = postsSlice.actions;

export default postsSlice.reducer;
