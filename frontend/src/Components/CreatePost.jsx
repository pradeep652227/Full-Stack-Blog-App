import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { clearPosts } from "../features/postsSlice";

export default function CreatePost() {
  const [postData, setPostData] = useState({
    title: "",
    image: null,
    content: "",
  });
  const navigateTo = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const dispatch = useDispatch();

  function handleChange(e) {
    const { name: field, value } = e.target;
    if (field === "image") {
      console.log(e.target.files[0]);
      setPostData((prevVal) => ({ ...prevVal, [field]: e.target.files[0] }));
    } else setPostData((prevVal) => ({ ...prevVal, [field]: value }));
  }

  function handleSubmit(e) {
    // const cachedUser = JSON.parse(sessionStorage.getItem("cachedUser"));
    e.preventDefault();
    let formData = new FormData();

    formData.append("title", postData.title);
    formData.append("image", postData.image);
    formData.append("content", postData.content);
    formData.append("isPrivate", isLoggedIn ? "true" : "false"); //if logged then private post else public post
    formData.append("userId", isLoggedIn ? userDetails.id : "");
    formData.append(
      "userName",
      isLoggedIn
        ? userDetails.first_name + " " + userDetails.last_name
        : "Anonymous"
    );

    axios
      .post("/server-create-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        window.alert(res.data);
        sessionStorage.removeItem("cachedPosts"); //clear the session cache
        dispatch(clearPosts());
        navigateTo("/");
        //
      })
      .catch((err) =>
        window.alert(
          "Error in Connecting to the Server.\nPlease try again Later.\nOr Contac the Developer if the issue persists!!"
        )
      );
  }
  return (
    <div id="create-post-div" className="py-8">
      <h1 className="text-3xl text-center mb-2">Create A Post!!</h1>
      <form
        className="space-y-4 w-full px-12"
        onSubmit={handleSubmit}
        method="POST"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="block w-full border-2 rounded-lg p-2 text-lg"
          value={postData.title}
          onChange={handleChange}
        />
        <label htmlFor="file" className="font-medium">
          Cover Image:-{" "}
        </label>
        <input
          id="file"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <textarea
          name="content"
          rows="4"
          placeholder="Content"
          className="block w-full border-2 p-2 rounded-md"
          value={postData.content}
          onChange={handleChange}
        ></textarea>
        <button className="block w-96 mx-auto border-2 p-2 rounded-xl text-3xl bg-slate-400 hover:bg-slate-200 duration-200">
          Go Live
        </button>
      </form>
    </div>
  );
}
