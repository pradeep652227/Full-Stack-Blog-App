import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addPosts} from "../features/postsSlice";
import axios from "axios";

export default function BlogPostPublic() {
  const { postId } = useParams();
  const [pagePost, setPagePost] = useState({
    title:"",
    content:"",
    image:"",
  });
  const publicPosts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  useEffect(() => {
    console.log("publicPosts length:", publicPosts.length);
    let cachedPosts = JSON.parse(sessionStorage.getItem("cachedPosts")); // Get cached posts
    console.log("cachedPosts:", cachedPosts);
    
      if (cachedPosts) {//for the 2nd run of useEffect and we'll find our data in the cached version == eliminating 2nd call to the server (redundant).
        console.log("Cached Block!!")
        dispatch(addPosts(cachedPosts));
        const post = cachedPosts.find((post) => (post._id.slice(5,10)+post._id.slice(-5)) === postId);
        if (post) {
          setPagePost(post);
        } else {
          navigateTo("/");
          window.alert("No Public Post Fetched!!");
        }
      }
    else{
      axios
        .get("/api/public-posts")
        .then((result) => {
          console.log("Else Block")
          let posts = result.data.posts;
          console.log("posts array:-")
          console.log(posts);
          sessionStorage.setItem("cachedPosts", JSON.stringify(posts));
          dispatch(addPosts(posts));//dispatch action state update takes time
          const post = posts.find((post) => (post._id.slice(5,10)+post._id.slice(-5)) === postId);
          if (post) {
            setPagePost(post);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className="blog-post-div">
      <h1 className="text-3xl text-center py-6">{pagePost.title}</h1>
      
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
