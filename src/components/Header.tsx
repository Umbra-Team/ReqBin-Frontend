import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const headerStyle = {
    backgroundColor: "#333",
    color: "white",
    padding: "10px",
  };

  return (
    <div style={headerStyle}>
      <h1>Request Bucket</h1>
      <nav>
        <Link to='/'>Home</Link>
        <span> | </span>
        <Link to='/bins'>Buckets</Link>
      </nav>
    </div>
  );
};

export default Header;
