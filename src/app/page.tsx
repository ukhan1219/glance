import React from "react";
import Image from "next/image";
import glancePNG from "public/glance2.png";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="bg-site-background min-h-screen flex items-center justify-center text-white pb-40">
        <div className="flex w-19/12">
          {/* Left Section - Text Section */}
          <div className="w-8/12 p-10 flex flex-col justify-center">
            <p
              className="fira-sans-regular text-white"
              style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "0%" }}
            >
              Take Control of Your Finances with Glance
            </p>
            <p className="fira-sans-regular text-white mt-4">
              Glance is your all-in-one financial hub, seamlessly connecting all your accounts in one place. Whether it's
              your checking or savings accounts, stocks, crypto holdings, or other investments, Glance provides a clear
              overview of your entire financial landscape. Monitor balances, track your assets, and manage your wealth with
              ease—all in a simple, intuitive interface. Stay informed, make smarter decisions, and unlock the power of your
              finances.
            </p>
          </div>
          {/* Right Section - Logo Container */}
          <div className="w-5/12 flex justify-center items-center">
            <div className="bg-site-foreground w-3/4 h-auto rounded-lg flex items-center justify-center p-10">
              <Image src={glancePNG} alt="Logo" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
