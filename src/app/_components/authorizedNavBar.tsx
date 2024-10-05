import React from "react";

const AuthorizedNavBar = ({ name }) => {
  return (
    <div style={{ backgroundColor: "#292464", minHeight: "100vh", color: "#fff", padding: "20px", paddingTop: "5px" }}>
      <title>Glance</title>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {}
        <div>
          <h1 className="manrope-custom" style={{ fontSize: "4rem", fontWeight: "bold", marginTop: "0", paddingTop: "0" }}>Glance</h1>
          <h2 className="fira-sans-regular" style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "0%" }}>
            Welcome back, {name}
          </h2>
        </div>
        
        {/* Right Side - Buttons */}
        <div>
          <button className="fira-sans-regular" style={buttonStyle}>Dashboard</button>
          <button className="fira-sans-regular" style={buttonStyle}>Insights</button>
        </div>
      </div>

      {/* Divider Line */}
      <div style={{ height: "1px", backgroundColor: "#fff", marginTop: "10px", width: "100%" }}></div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: "#fff",
  color: "#292464",
  border: "none",
  padding: "10px 20px",
  marginLeft: "10px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold"
};

export default AuthorizedNavBar;
