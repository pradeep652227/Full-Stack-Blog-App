/* eslint-disable react/prop-types */
import React, { useId } from "react";

const Select = React.forwardRef(function Select(
  { options, defaultValue, label, className, ...props },
  ref
) {
  const uniqueId = useId();

  return (
    <div className="select w-full">
      {label && <label htmlFor={uniqueId}>{label}</label>}
      <select
        id={uniqueId}
        className={`select px-3 py-2 rounded-lg ${className}`}
        defaultValue={defaultValue}
        ref={ref}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={defaultValue}>{option}</option>
        ))}
      </select>
    </div>
  );
});

export default Select;
