import React, { useEffect, useState } from "react";
import { PostForm } from "./imports-components";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addPosts } from "../features/postsSlice";
export default function EditPost() {
  const {slug} = useParams();
  const [post, setPost] = useState(null);
  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();
  const cachedPosts = JSON.parse(sessionStorage.getItem("cachedPosts"));
  useEffect(() => {
    let postFound = null;
    if (cachedPosts) {
        dispatch(addPosts(cachedPosts));
        postFound = cachedPosts.find((post) => post.slug === slug);
        postFound && setPost(postFound);
      }
  }, [slug]);

  return <>{post ? <PostForm post={post} /> : <h1>Loading...</h1>}</>;
}
