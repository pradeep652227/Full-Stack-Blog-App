import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function BlogPostPrivate() {
  const { postId } = useParams();
  const [pagePost, setPagePost] = useState({
    title:"",
    content:"",
    image:"",
  });
  const navigateTo = useNavigate();
  const cachedUser=JSON.parse(sessionStorage.getItem("cachedUser"));

  useEffect(() => {

  if(cachedUser?.isLoggedIn){
    const post = (cachedUser.posts).find((post) => (post._id.slice(5,10)+post._id.slice(-5)) === postId);
    if (post) {
      setPagePost(post);
    } else {
      navigateTo("/");
      window.alert("No Private Post Fetched!!");
    }
  }
    else{
      window.alert("Please Sign-In and then access this route!!");
      navigateTo("/");
    }
  }, []);

  return (
    <div className="blog-post-div">
      <h1 className="text-3xl text-center py-6">{pagePost.title} by {cachedUser?.first_name}</h1>
      <div>
        <img
          className="rounded-md w-9/12 mx-auto"
          src={`${pagePost.imgURLPrefix}${pagePost.image}`}
          alt={"A Blog Post with Title= " + pagePost.title}
        />
        <p className="p-2">{pagePost.content}</p>
      </div>
    </div>
  );
}
