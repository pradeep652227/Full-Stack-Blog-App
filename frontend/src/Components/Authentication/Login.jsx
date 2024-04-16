import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addDetails } from "../../features/authSlice";

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.auth.userDetails);
  useEffect(() => {
    const cachedUser = JSON.parse(sessionStorage.getItem("cachedUser"));

    if (userDetails.isLoggedIn || (cachedUser && cachedUser.isLoggedIn)) {
      alert("User is Already Logged In. Redirect you to Home Route!!");
      setTimeout(() => {
        navigateTo("/");
      }, 1000);
    }
  }, []);
  const navigateTo = useNavigate();
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
        let userObj = res.data;
        if (!userObj) {
          window.alert("Either email or password is wrong!!");
        } else {
          sessionStorage.setItem("cachedUser", JSON.stringify(userObj)); //caching the logged in user details
          dispatch(addDetails(res.data));
          navigateTo("/");
        }
      })
      .catch((err) => {
        // window.alert(err.response.data.message);
        window.alert(err.response.data.message);
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
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          className={input_classes}
          value={loginData.password}
          onChange={handleChange}
          required
        />
        <button className="w-full border-2 rounded-xl text-3xl p-2 hover:bg-gray-400">
          Login
        </button>
      </form>
    </div>
  );
}
