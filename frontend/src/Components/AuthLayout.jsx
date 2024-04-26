/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDetails } from "../features/authSlice";
import { addPosts } from "../features/postsSlice";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({ children }) {
  const [loader, setLoader] = useState(true);
  const navigateTo = useNavigate();
  const cachedUser = JSON.parse(sessionStorage.getItem("cachedUser"));
  const cachedPosts = JSON.parse(sessionStorage.getItem("cachedPosts"));
  const authStatus = useSelector((state) => state.auth.isLoggedIn);
  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authStatus === false && cachedUser) dispatch(addDetails(cachedUser));

    if (!posts && cachedPosts) dispatch(addPosts(cachedPosts));

    // if (cachedUser) {
    //   if (authStatus === false) {
    //     dispatch(addDetails(cachedUser));
    //   }
    // }
    // if (cachedPosts) {
    //   if (!posts) dispatch(addPosts(cachedPosts));
    // }
    setLoader(false);
  }, [authStatus, navigateTo, cachedUser, cachedPosts]);

  return loader ? <h1>Loading...</h1> : <>{children}</>;
}
