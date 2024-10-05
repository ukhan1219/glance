import React from "react";

const NotAuthorizedNavBar = () => {
  return (
    <div className="bg-[#292464] text-white p-5">
      <title>Glance</title>

      <div className="flex justify-between items-center">
        {/* Left Side - Title and Welcome Message */}
        <div> 
          <h1 className="manrope-custom" style={{ fontSize: "4rem", fontWeight: "bold", marginTop: "0%" }}>Glance</h1>
          <h2 className="fira-sans-regular" style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "0%" }}>
            Welcome back, 
          </h2>
        </div>

        {/* Right Side - Buttons */}
        {/* Insight and dash buttons */}
        <div className="flex gap-16 mt-10"> 
          <button className="fira-sans-regular" style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "10%" }}>
            About
          </button>
          {/* Settings Icon */}
          <button className="fira-sans-regular" style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "10%" }}>
            Login
          </button>
        </div>
      </div>

      {/* Divider Line */}
      <div className="h-px bg-white mt-2 w-full"></div>
    </div>
  );
};

export default NotAuthorizedNavBar;
