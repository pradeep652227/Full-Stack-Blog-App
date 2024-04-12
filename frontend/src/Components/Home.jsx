import React from "react";
import {useSelector} from "react-redux";

export default function Home(){
    const userDetails=useSelector(state=>state.userDetails);
    return(
        <div className="flex items-center justify-center py-44 comfortaa">
            <h1 className="text-3xl">
            {(userDetails.isLoggedIn)?
                `${userDetails.first_name} is Logged In`
                :
                "Login to Read Posts!!"
            }
            </h1>
        </div>
    );
}