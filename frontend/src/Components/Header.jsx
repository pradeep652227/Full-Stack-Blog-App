import React from "react";
import { Link, NavLink } from "react-router-dom";
export default function Header() {
  let logoStyles = {
    width: "40px",
    height: "40px",
  };
  let nav_linkClasses =
    "inline-block text-xl border border-1 rounded-full border-transparent hover:border-inherit hover:bg-gray-100 duration-200 p-2 box-border";

  return (
    <header id="main_header" className="bg-gray-400">
      <div
        style={{ width: "98vw" }}
        className="mx-auto flex flex-wrap justify-between py-2 "
      >
        <div id="img_logo_div">
          <img
            id="logo_img"
            style={logoStyles}
            src="https://cdn.pixabay.com/photo/2014/04/02/10/16/fire-303309_1280.png"
          />
        </div>
        <div className="">
          <ul className="flex flex-wrap space-x-4">
            <li className="">
              <NavLink className={({isActive})=>`${nav_linkClasses} ${isActive?'text-gray-100':''}`} to="/">
                Home
              </NavLink>
            </li>
            <li className="">
              <NavLink className={({isActive})=>`${nav_linkClasses} ${isActive?'text-gray-100':''}`} to="/login">
                Login
              </NavLink>
            </li>
            <li className="">
              <NavLink className={({isActive})=>`${nav_linkClasses} ${isActive?'text-gray-100':''}`} to="/signup">
                Signup
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
