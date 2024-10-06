import React from "react";
import NotAuthorizedNavBar from "../_components/notauthorizedNavBar";
import { HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default function InsightsPage() {
  return (
    <HydrateClient>
      <div className="bg-site-background min-h-screen text-white">
        {/* <NotAuthorizedNavBar /> */}

        {/* First Row */}
        <div className="bg-[#292464] text-white p-5 flex space-x-5 h-[35vh]">
          {/* Left Foreground Div */}
          <div className="bg-site-foreground w-2/5 h-[250%] rounded-lg relative p-10">
            {/* Content for left div */}
            <div className="absolute bottom-0 left-0 p-2">
              <p className="fira-sans-regular">Screener:</p>
            </div>
          </div>

          {/* Right Foreground Div */}
          <div className="bg-site-foreground w-3/5 h-[250%] rounded-lg relative p-10">
            {/* Content for right div */}
            <div className="absolute bottom-0 left-0 p-2">
              <p className="fira-sans-regular">Personalized investing news:</p>
            </div>
          </div>
        </div>

        
      </div>
    </HydrateClient>
  );
};

