import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./features/store/store";

import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom";

import * as Components from "./imports/component-imports";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Components.Layout />}>
      <Route path="" element={<Components.Home />} />
      <Route path="login" element={<Components.Login />} />
      <Route path="signup" element={<Components.SignUp />} />
      <Route path="create-post" element={<Components.CreatePost />} />
      <Route path="posts" element={<Components.Home />} />
      <Route path="posts/public/:postId" element={<Components.BlogPostPublic />} />
      <Route path="posts/private/:postId" element={<Components.BlogPostPrivate />} />
    </Route>
  )
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
