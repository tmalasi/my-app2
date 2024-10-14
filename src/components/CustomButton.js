import React from 'react';

const CustomButton = ({ text, onClick, type = 'button' }) => {
  return (
    <button type={type} onClick={onClick}>
      {text}
    </button>
  );
};

export default CustomButton;
