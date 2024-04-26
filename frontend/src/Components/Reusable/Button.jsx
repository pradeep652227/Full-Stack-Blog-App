/* eslint-disable react/prop-types */
import React from "react";

export default function Button({
  type = "button",
  className,
  children,
  ...props
}) {
  return (
      <button
        type={type}
        className={`button px-4 py-2 rounded-lg bg-blue-600 text-white ${className}`}
        {...props}
      >
        {children}
      </button>
  );
}
