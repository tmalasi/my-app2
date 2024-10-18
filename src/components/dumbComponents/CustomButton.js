import React from "react";

const CustomButton = React.memo(({ text, onClick, type = "button" }) => {
  return (
    <button type={type} onClick={onClick}>
      {text}
    </button>
  );
});

export default CustomButton;
