/* eslint-disable react/prop-types */
import React, { useId } from "react";

function Input({ label, type = "text", className, ...props }, ref) {
  const uniqueId = useId();
  return (
    <div className="input w-full">
      {label && <label htmlFor={uniqueId}>{label}</label>}
      <input
        id={uniqueId}
        type={type}
        className={`w-full px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 ${className}`}
        ref={ref}
        {...props}
      />
    </div>
  );
}

export default React.forwardRef(Input);
