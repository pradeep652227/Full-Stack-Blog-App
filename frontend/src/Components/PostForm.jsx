/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button, Select } from "./imports-components";
import RTE from "./RTE";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearPosts } from "../features/postsSlice";
import axios from "axios";
import upload from "../services/upload";

export default function PostForm({ post }) {
  const navigateTo = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userDetails = useSelector((state) => state.auth.userDetails);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, control, setValue, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "",
      },
    });

  const slugTransform = useCallback((value) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z\d]+/g, "-");
  }, []);

  const submitForm = async (postData) => {
    setIsLoading(true);
    const randomNumber = Math.floor(Math.random() * 10000);
    const slug = postData.slug + "-" + randomNumber;
     
    let sendData = {
      title: postData.title,
      slug: slug,
      content: postData.content,
      isPrivate: isLoggedIn ? postData.status === "Private" : "false",
    };
    if (post) {
      window.alert("Hello");
      //update the post
      if (postData.image[0]) {
        upload.deleteImage(post.image);
        window.alert("Deleted The Old Image");
        sendData["image"]=await upload.uploadImage(postData.image[0]);//required->false in case of updating
      }
      sendData["postId"] = post._id;
      axios
        .post("/update-post", sendData)
        .then((result) => {
          console.log("Result of updating post is:-");
          console.log(result);
        })
        .catch((err) => {
          console.log("Error in Updating post:-");
          console.log(err);
          window.alert("Error in Updating the Post");
        });
    } else {
      //create a new post
      sendData["image"]=await upload.uploadImage(postData.image[0]);
      sendData["userId"] = isLoggedIn ? userDetails.id : "";
      sendData["userName"] = isLoggedIn
        ? userDetails.first_name + " " + userDetails.last_name
        : "Anonymous";
      axios
        .post("/server-create-post", sendData)
        .then((res) => {
          console.log(res);
          window.alert(res.data);
        })
        .catch((err) => {
          console.log("Error in Creating post:-");
          console.log(err);
          window.alert("Error in Creating the Post");
        });
    }
    sessionStorage.removeItem("cachedPosts"); //clear the session cache
    dispatch(clearPosts());
    setIsLoading(false);
    navigateTo("/");
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title")
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <>
      {isLoading ? (

          <div className="flex flex-wrap justify-center items-center py-32 flex-col space-y-8">
            <h1 className="text-3xl ">Form Submission in Progress...</h1>
            <h1 className="text-3xl ">Wait For Sometime!!</h1>
          </div>

      ) : (
        <form
          onSubmit={handleSubmit(submitForm)}
          className="flex flex-wrap gap-x-2 px-2 py-2"
          method="POST"
        >
          <div className="w-4/6">
            <Input
              label="Title: "
              className="mb-4"
              placeholder="Title"
              {...register("title", { required: true })}
            />
            <Input
              label="Slug: "
              className="mb-4"
              {...register("slug", { required: true })}
              onInput={(e) => {
                setValue("slug", slugTransform(e.currentTarget.value), {
                  shouldValidate: true,
                });
              }}
            />
            <RTE
              label="Content: "
              name="content"
              control={control}
              defaultValue={getValues("content")}
            />
          </div>
          <div className="w-1/6">
            {post && (
              <img
                src={upload.getImagePreview(post.image)}
                alt={`Image of Blog Post with Title ${post?.title}`}
                className="rounded-xl"
              />
            )}
            <Input
              label="Cover Image:-"
              type="file"
              accept="image/jpg image/png image/jpeg"
              className="mb-4"
              {...register("image", { required: post ? false : true })}
              onChange={(e) => {
                console.log(e.currentTarget.files[0].name);
              }}
            />
            {isLoggedIn && (
              <Select
                options={["Private", "Public"]}
                label="Status: "
                className="mb-4 border-2 outline-none"
                {...register("status", { required: true })}
              />
            )}

            <Button type="submit" disabled={isLoading}>
              {post ? "Save Post" : "Create Post"}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
