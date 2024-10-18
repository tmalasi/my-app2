import React from "react";

function Header({ text }) {
  return (
    <h1
      style={{
        marginBottom: "20px",
        color: "#d31900",
        fontFamily: "'Times New Roman', Times, serif",
        fontStyle: "italic",
      }}
    >
      {text}
    </h1>
  );
}

export default Header;
