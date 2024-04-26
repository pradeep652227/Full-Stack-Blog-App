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
import AuthLayout from "./Components/AuthLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AuthLayout><Components.Layout /></AuthLayout>}>
      <Route path="" element={<Components.Home />} />
      <Route path="login" element={<Components.Login />} />
      <Route path="signup" element={<Components.SignUp />} />
      <Route path="create-post" element={<Components.PostForm />} />
      <Route path="posts" element={<Components.Home />} />
      <Route path="posts/:slug" element={<AuthLayout><Components.BlogPostPublic /></AuthLayout>} />
      <Route path="edit-post/:slug" element={<Components.EditPost />} />
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
