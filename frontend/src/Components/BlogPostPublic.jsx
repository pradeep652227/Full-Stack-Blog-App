import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addPosts } from "../features/postsSlice";
import axios from "axios";
import Button from "./Reusable/Button";
import { Link } from "react-router-dom";
import { clearPosts } from "../features/postsSlice";
import parse from "html-react-parser";
import upload from "../services/upload";

export default function BlogPostPublic() {
  const { slug } = useParams();
  const [pagePost, setPagePost] = useState({
    title: "",
    content: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const userDetails = useSelector((state) => state.auth.userDetails);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  useEffect(() => {
    let cachedPosts = JSON.parse(sessionStorage.getItem("cachedPosts")); // Get cached posts
    let post = null;

    if (cachedPosts) {
      //for the 2nd run of useEffect and we'll find our data in the cached version == eliminating 2nd call to the server (redundant).
      console.log("Cached Block!!");
      dispatch(addPosts(cachedPosts));
      post = cachedPosts.find((post) => post.slug === slug);
      if (post) {
        setPagePost(post);
      } else {
        navigateTo("/");
        window.alert("No Posts Fetched!!");
      }
    } else {
      //first ever call to the backend posts route
      let userId = null;
      if (isLoggedIn) userId = userDetails.id;

      axios
        .get("/api/posts/" + userId)
        .then((result) => {
          console.log("Else Block");
          let posts = result.data;
          posts && sessionStorage.setItem("cachedPosts", JSON.stringify(posts));
          posts && dispatch(addPosts(posts)); //dispatch action state update takes time
          post = posts.find((post) => post.slug === slug);
          if (post) {
            setPagePost(post);
          } else {
            navigateTo("/");
            window.alert("No Posts Fetched!!");
          }
        })
        .catch((err) => {
          window.alert(
            "Error in Connecting to the Server.\nPlease try again Later.\nOr Contac the Developer if the issue persists!!"
          );
        });
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex flex-wrap justify-center items-center py-32 flex-col space-y-8">
          <h1 className="text-3xl ">Form Submission in Progress...</h1>
          <h1 className="text-3xl ">Wait For Sometime!!</h1>
        </div>
      ) : (
        <div className="blog-post-div">
          <h1 className="text-3xl text-center py-3">{pagePost.title}</h1>
          <h2 className="text-2xl text-right pb-6">By {pagePost.userName}</h2>
          <div>
            <div className="relative">
              <img
                className="rounded-md w-9/12 mx-auto"
                src={upload.getImagePreview(pagePost.image, {
                  width: 0,
                  height: 0,
                })}
                alt={"A Blog Post with Title= " + pagePost.title}
              />
              <div className="buttons absolute top-6 right-6">
                <Link to={`/edit-post/${pagePost.slug}`}>
                  <Button className="bg-green-500">Edit</Button>
                </Link>
                <Button
                  onClick={handleDeletePost}
                  className="bg-red-500 cursor-pointer"
                >
                  Delete
                </Button>
              </div>
            </div>

            <p className="p-2">{parse(pagePost.content)}</p>
          </div>
        </div>
      )}
    </>
  );
  /*Return Statement Ends*/
  function handleDeletePost() {
    if(pagePost.userName==="Anonymous"){
      window.alert("Public Posts can only be Deleted by the Dev");
      navigateTo("/");
    }
    let flag = 0;
    if (pagePost) {
      console.log("1st block");
      if (!isLoggedIn) {
        console.log("2nd If");
        //if user is not logged in
        if (pagePost.userName !== "Anonymous") {
          console.log("3rd If and username=" + pagePost?.userName);
          //The post is created by a user
          flag = 1;
        }
      } else if (userDetails?.id !== pagePost.userId) {
        flag = 1;
        console.log("else if");
      }

      if (flag) {
        window.alert("You are not The User to Delete this Post!!");
        setTimeout(() => navigateTo("/"), 1000);
      }
    }
    if (!flag) {
      //public posts can't be deleted!!
      setIsLoading(true);
      axios
        .get(`/api/delete-post/${pagePost._id}`)
        .then((res) => {
          console.log("Handle Delete Function");
          sessionStorage.removeItem("cachedPosts");
          dispatch(clearPosts());
          upload.deleteImage(pagePost.image);
        })
        .catch((err) => {
          console.log("Error in Handle Delete Function");
          window.alert(
            "Error in Connecting to the Server.\nPlease try again Later.\nOr Contac the Developer if the issue persists!!"
          );
        });

      setIsLoading(false);
      navigateTo("/");
    }
  }
}
