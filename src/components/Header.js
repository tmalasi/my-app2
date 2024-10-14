// Header.js
import React from "react";

function Header({text}) {
  return (
    <h1 style={{ marginBottom: "50px", color: "blueviolet" }}>
      {text}
    </h1>
  );
}

export default Header;
