import React from "react";

const Inputs = React.memo(({ type, value, onChange, placeholder, min, checked }) => {
  return (
    <input
      type={type}
      value={type === "checkbox" ? undefined : value} // Value for non-checkbox types
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      checked={type === "checkbox" ? checked : undefined} // Checked prop for checkboxes
    />
  );
});
export default Inputs;
