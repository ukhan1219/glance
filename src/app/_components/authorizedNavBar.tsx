import React from "react";

const AuthorizedNavBar = ({ name }) => {
  return (
    <div className="bg-[#292464] min-h-screen text-white p-5">
      <title>Glance</title>

      <div className="flex justify-between items-center">
        {/* Left Side - Title and Welcome Message */}
        <div> 
          <h1 className="manrope-custom text-4xl font-bold mt-0 pt-0">Glance</h1>
          <h2 className="fira-sans-regular text-2xl font-bold mt-0">
            Welcome back, {name}
          </h2>
        </div>

        {/* Right Side - Buttons */}
        {/* Insight and dash buttons */}
        <div className="flex gap-16 mt-10"> {}
          <button className="text-white text-2xl px-4 rounded">
            Dashboard
          </button>
          <button className="text-white text-2xl px-4 rounded">
            Insights
          </button>
          {/* Settings Icon */}
          <div className="flex gap-16"> {}
          <button className="text-white text-2xl px-4 rounded">
            Logout
          </button>
        </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="h-px bg-white mt-2 w-full"></div>
    </div>
  );
};

export default AuthorizedNavBar;
