import React from "react";

const Inputs = ({ type, value, onChange, placeholder, min }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange} // Use the correct prop name
      placeholder={placeholder}
      min={min}
    />
  );
};

export default Inputs;
