import React from "react";
import AuthorizedNavBar from "../_components/authorizedNavBar";
import { HydrateClient } from "~/trpc/server";

const NewPage = () => {
  return (
    <HydrateClient>
      <div className="bg-site-background min-h-screen text-white">
        <AuthorizedNavBar />

        {/* First Row */}
        <div className="bg-[#292464] text-white p-5 flex space-x-5 h-[35vh]">
          {/* Left Foreground Div */}
          <div className="bg-site-foreground w-2/5 h-[115%] rounded-lg relative p-10">
            {/* Content for left div */}
            <div className="absolute bottom-0 left-0 p-2">
              <p className="fira-sans-regular">Spending:</p>
            </div>
          </div>

          {/* Right Foreground Div */}
          <div className="bg-site-foreground w-3/5 h-[115%] rounded-lg relative p-10">
            {/* Content for right div */}
            <div className="absolute bottom-0 left-0 p-2">
            <p className="fira-sans-regular">Most Spent:</p>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="bg-[#292464] text-white p-5 flex space-x-5 h-[35vh] mt-7">
          {/* Left Foreground Div */}
          <div className="bg-site-foreground w-3/5 h-[115%] rounded-lg relative p-10">
            {/* Content for left div */}
            <div className="absolute bottom-0 left-0 p-2">
            <p className="fira-sans-regular">Most Invested:</p>
            </div>
          </div>

          {/* Right Foreground Div */}
          <div className="bg-site-foreground w-2/5 h-[115%] rounded-lg relative p-10">
            {/* Content for right div */}
            <div className="absolute bottom-0 left-0 p-2">
            <p className="fira-sans-regular">Holdings:</p>
            </div>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
};

export default NewPage;