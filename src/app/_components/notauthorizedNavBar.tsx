import React from "react";
import Link from "next/link";

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

        {/* Insight and dash buttons */}
        <div className="flex gap-8 items-center"> 
          <Link href="/insights">
            <button className="fira-sans-regular" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Insights
            </button>
          </Link>
          <Link href="/dashboards">
            <button className="fira-sans-regular" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Dashboards
            </button>
          </Link>
          <Link href="/signIn">
            <button className="fira-sans-regular" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Sign In
            </button>
          </Link>
        </div>
      </div>

      {/* Divider Line */}
      <div className="h-px bg-white mt-2 w-full"></div>
    </div>
  );
};

export default NotAuthorizedNavBar;
