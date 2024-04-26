import React, { useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LogoutBtn from "./LogoutBtn";
import { useSelector } from "react-redux";

export default function Header() {
  let logoStyles = {
    width: "40px",
    height: "40px",
  };
  let nav_linkClasses =
    "inline-block text-xl border border-1 rounded-full border-transparent hover:border-inherit hover:bg-gray-100 duration-200 p-2 box-border";

 const authStatus=useSelector(state=>state.auth.isLoggedIn);

  const items = [
    {
      name: "Home",
      toShow: true,
      slug: "/",
    },
    {
      name: "Login",
      toShow: !authStatus,
      slug: "/login",
    },
    {
      name: "Signup",
      toShow: !authStatus,
      slug: "/signup",
    },
    {
      name: "All Posts",
      toShow: authStatus,
      slug: "/posts",
    },
    {
      name: "Create Post",
      toShow: authStatus,
      slug: "/create-post",
    },
  ];
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
            {items.map((item) => {
              return item.toShow ? (
                <li key={item.name} className="">
                  <NavLink
                    className={({ isActive }) =>
                      `${nav_linkClasses} ${isActive ? "text-gray-100" : ""}`
                    }
                    to={item.slug}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ) : (
                ""
              );
            })}
            {authStatus && <LogoutBtn className="bg-gray-400" />}
          </ul>
        </div>
      </div>
    </header>
  );
}
