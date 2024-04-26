import React, { useEffect, useState } from "react";
import axios from "axios";
import { data } from "autoprefixer";
import { useDispatch} from "react-redux";
import { addDetails } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const dispatch=useDispatch();
  const navigateTo=useNavigate();

  function resetFormData() {
    setFormData((prevFormData) => {
      const updatedFormData = {};
      Object.keys(prevFormData).forEach((key) => {
        updatedFormData[key] = "";
      });
      return updatedFormData;
    });
  }

  let input_classes = "block w-full p-2 border-2 rounded-md";

  function handleChange(e) {
    const { name: inputName, value: inputVal } = e.target;
    setFormData((prevVal) => ({ ...prevVal, [inputName]: inputVal }));
  }
  
  function handleClick(e) {
    e.preventDefault();
    // const target = e.target;
    // const dataObj = {
    //   first_name: target.elements["first_name"].value,
    //   last_name: target.elements["last_name"].value,
    //   email: target.elements["email"].value,
    //   password: target.elements["password"].value,
    // };
    //now send this data to backend

    //axios will send the data in stringified format
    axios
      .post("/post-signup", formData)
      .then((res) => {
        console.log("User Registererd with details:-");
        console.log(res);
        res && sessionStorage.setItem("cachedUser",JSON.stringify(res.data));//caching the userdetails
        dispatch(addDetails(res.data));
        sessionStorage.removeItem("cachedPosts");//removing the public posts cache
        navigateTo("/");
        // resetFormData();
      })
      .catch((err) => {
        window.alert(`Error(s):-\n${err.response.data.message}`);
        console.log(
          `Error Status= ${err.status} | Error Message= ${err.response.data.message}`
        );
        console.log(err);
      });
  }
  return (
    <div
      id="login comfortaa"
      className="flex flex-wrap justify-center items-center py-12"
    >
      <form
        method="post"
        onSubmit={handleClick}
        className="rounded-xl border-2 space-y-4 w-5/12 p-12 bg-gray-400"
      >
        <input
          name="first_name"
          type="text"
          placeholder="First Name"
          className={input_classes}
          onChange={handleChange}
          value={formData.first_name}
          required
        />
        <input
          name="last_name"
          type="text"
          placeholder="Last Name"
          className={input_classes}
          onChange={handleChange}
          value={formData.last_name}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className={input_classes}
          onChange={handleChange}
          value={formData.email}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className={input_classes}
          onChange={handleChange}
          value={formData.password}
          required
        />
        <button
          type="submit"
          className="w-full text-center border-2 rounded-xl p-2 hover:bg-gray-100 duration-200"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
