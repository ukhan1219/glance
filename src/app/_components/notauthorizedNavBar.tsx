"use client"; // Mark this as a client-side component
import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const NotAuthorizedNavBar = ({ session }: { session: any }) => {
  // Handle client-side signout
  const handleLogout = () => {
    localStorage.clear();
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="bg-[#292464] text-white p-5">
      <div>
      <title className="text-[#E5CFA2]">Glance</title>
      </div>
      <div className="flex justify-between items-center">
        {/* Left Side - Title and Welcome Message */}
        <div>
          <Link href="/">
            <h1
              className="manrope-custom"
              style={{ fontSize: "4rem", fontWeight: "bold", marginTop: "0%" }}
            >
              Glance
            </h1>
          </Link>
        </div>

        {/* Insight and dash buttons */}
        <div className="flex gap-8 items-center">
          <Link href="/preInsight">
            <button
              className="fira-sans-regular"
              style={{ fontSize: "1.5rem", fontWeight: "bold" }}
            >
              Insights
            </button>
          </Link>
          <Link href="/preDash">
            <button
              className="fira-sans-regular"
              style={{ fontSize: "1.5rem", fontWeight: "bold" }}
            >
              Dashboards
            </button>
          </Link>

          {/* Conditionally render sign-in or logout button based on session status */}
          {session ? (
            <button
              onClick={handleLogout}
              className="fira-sans-regular"
              style={{ fontSize: "1.5rem", fontWeight: "bold" }}
            >
              Logout
            </button>
          ) : (
            <Link href="/signIn">
              <button
                className="fira-sans-regular"
                style={{ fontSize: "1.5rem", fontWeight: "bold" }}
              >
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Divider Line */}
      <div className="h-px bg-white mt-2 w-full"></div>
      </div>
  );
};

export default NotAuthorizedNavBar;
