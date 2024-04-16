import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { addPosts } from "../features/postsSlice";

export default function Home() {
  const userDetails = useSelector((state) => state.auth.userDetails);
  const cachedUser=JSON.parse(sessionStorage.getItem("cachedUser"));

  const publicPosts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();

  let img_styles = { width: "200px", height: "100px" };
  let img_classes = "rounded-md";

  useEffect(() => {
    const cachedPosts = JSON.parse(sessionStorage.getItem("cachedPosts"));
    if (cachedPosts) {
      console.log("Cached Block");
      console.log(cachedPosts);
      dispatch(addPosts(cachedPosts));
    } else {
      console.log("Else Block")
      axios
        .get("/api/public-posts")
        .then((result) => {
          let posts = result.data.posts;
          sessionStorage.setItem("cachedPosts", JSON.stringify(posts));
          dispatch(addPosts(posts));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []); // Empty dependency array to run the effect only once

  return (
    <div className="comfortaa">
      <h1 className="text-3xl py-12 text-center">
        {(cachedUser?.isLoggedIn)
          ? `${cachedUser.first_name} is Logged In`
          : "Login to Read Posts!!"}
      </h1>
      {cachedUser?.isLoggedIn ? (
        <>
          <h1 className="text-xl">Blog Posts by {cachedUser.first_name}:-</h1>
          <div className="flex flex-wrap justify-between">
            {cachedUser.posts.map((post) => {
              return (
                <div className="public-blog-div" key={post._id}>
                  <Link
                    to={`/posts/private/${post._id.slice(5, 10)}${post._id.slice(-5)}`}
                  >
                    <img
                      src={`${post.imgURLPrefix}${post.image}`}
                      alt="A Blog Post"
                      style={img_styles}
                      className={img_classes}
                    />
                    <span className="block">{post.title}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        ""
      )}
      {/* {publicPosts.length && (
        <h1 className="text-xl mb-2">Some of the Public Blog Posts:-</h1>
      )} */}
      {publicPosts.length && (
        <h1 className="text-xl mt-6">Public Posts:-</h1>
      )}
      <div className="flex flex-wrap justify-between">
        {publicPosts.map((post) => {
          return (
            <div className="public-blog-div" key={post._id}>
              <Link to={`/posts/public/${post._id.slice(5, 10)}${post._id.slice(-5)}`}>
                <img
                  src={`${post.imgURLPrefix}${post.image}`}
                  alt="A Blog Post"
                  style={img_styles}
                  className={img_classes}
                />
                <span className="block">{post.title}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
