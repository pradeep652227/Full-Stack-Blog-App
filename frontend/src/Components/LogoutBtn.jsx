import React from "react";
import { useDispatch } from "react-redux";
import { clearDetails } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import {clearPrivatePosts} from "../features/postsSlice";

export default function LogoutBtn(){
    const dispatch=useDispatch();
    const navigateTo=useNavigate();

    function logoutBtnHandler(){
        dispatch(clearDetails());
        dispatch(clearPrivatePosts());
        sessionStorage.removeItem("cachedUser");
        navigateTo("/");
    }   
    return(
            <button className='px-6 py-2 duration-200 hover:bg-blue-100 rounded-full' onClick={logoutBtnHandler} >
                Logout
            </button>
    );
}