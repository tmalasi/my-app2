import React from "react";

const Inputs = ({ type, value, onChange, placeholder, min, checked }) => {
  return (
    <input
      type={type}
      value={type === "checkbox" ? undefined : value} // Only use value for non-checkbox types
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      checked={type === "checkbox" ? checked : undefined} // Use checked prop for checkboxes
    />
  );
};

export default Inputs;
