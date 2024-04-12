import React, { useState,useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { addDetails } from "../../features/authSlice";

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const dispatch=useDispatch();
  const userDetails=useSelector(state=>state.userDetails);
  useEffect(()=>{
    if(userDetails.isLoggedIn){
      alert("User is Already Logged In. Redirect you to Home Route!!");
      setTimeout(()=>{
        navigateTo("/");
      },1000)
    }
  },[]);
  const navigateTo=useNavigate();
  function handleChange(e) {
    const { name: inputName, value: inputVal } = e.target;
    setLoginData((prevVal) => ({ ...prevVal, [inputName]: inputVal }));
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    //sending the login-data
    axios
      .post("/post-login", loginData)
      .then((res) => {
        console.log("Got the User Details from Server");
        console.log(res);
        dispatch(addDetails(res.data));
        navigateTo("/");
      })
      .catch((err) => {
        window.alert("Error in Sending or Retreiving User Details");
        console.log(err);
      });
  }
  let input_classes = "block border-2 rounded-md p-2 text-lg w-full";

  return (
    <div id="login comfortaa" className="py-44 flex flex-wrap justify-center">
      <form className="space-y-8 w-5/12" onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          type="email"
          className={input_classes}
          value={loginData.email}
          onChange={handleChange}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          className={input_classes}
          value={loginData.password}
          onChange={handleChange}
        />
        <button className="w-full border-2 rounded-xl text-3xl p-2 hover:bg-gray-400">
          Login
        </button>
      </form>
    </div>
  );
}
