import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { addPosts } from "../features/postsSlice";
import Button from "./Reusable/Button";

export default function Home() {
  const userDetails = useSelector((state) => state.auth.userDetails);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

  const serverPosts = useSelector((state) => state.posts.posts);
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
      console.log("Else Block");
      let userId = null;
      if (isLoggedIn) userId = userDetails.id;
      axios
        .get("/api/posts/" + userId)
        .then((result) => {
          window.alert("Called Backend!!");
          let posts = result.data;
          console.log(posts);
          posts && sessionStorage.setItem("cachedPosts", JSON.stringify(posts));
          posts && dispatch(addPosts(posts));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []); // Empty dependency array to run the effect only once

  return (
    <div className="comfortaa">
      <h1 className="text-3xl py-12 text-center">
        {isLoggedIn
          ? `${userDetails.first_name} is Logged In`
          : "Login to Read Posts!!"}
      </h1>
      {isLoggedIn ? (
        <>
          <h1 className="text-xl">Blog Posts by {userDetails.first_name}:-</h1>
          <div className="flex flex-wrap justify-between">
            {serverPosts?.map((post) => {
              if (post.isPrivate) {
                return (
                  <div className="public-blog-div" key={post._id}>
                    <Link to={`/posts/${post.slug}`}>
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
              }
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-wrap justify-center">
          <Link to="/create-post">
            <Button className={``}>Create Public Post</Button>
          </Link>{" "}
        </div>
      )}
      {/* {serverPosts.length && (
        <h1 className="text-xl mb-2">Some of the Public Blog Posts:-</h1>
      )} */}
      {serverPosts && <h1 className="text-xl mt-6">Public Posts:-</h1>}
      <div className="flex flex-wrap justify-between">
        {serverPosts?.map((post) => {
          if (!post.isPrivate) {
            return (
              <div className="public-blog-div" key={post._id}>
                <Link to={`/posts/${post.slug}`}>
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
          }
        })}
      </div>
    </div>
  );
}
