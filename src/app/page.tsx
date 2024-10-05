import React from "react";
import Link from "next/link";
import Image from "next/image";
import NotAuthorizedNavBar from "../app/_components/notauthorizedNavBar";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import glancePNG from "public/glance2.png";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <div className="bg-site-background min-h-screen text-white">
        <NotAuthorizedNavBar />
        <div className="flex justify-end min-h-screen p-10">
          {/* Text Section */}
          <div className="w-7/12">
            <p
              className="fira-sans-regular text-white"
              style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "0%" }}
            >
              Welcome to my personal page! Here's some information about me...
            </p>
          </div>

          {/* Right Section - Logo Container */}
          <div className="w-5/12 flex justify-center">
            <div className="bg-site-foreground w-3/4 h-1/2 rounded-lg flex items-center justify-center p-10">
              {/* Logo Image */}
              <Image src={glancePNG} alt="Logo" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
