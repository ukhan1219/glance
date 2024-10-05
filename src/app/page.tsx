import Link from "next/link";
import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import glancePNG from "public/glance2.png";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <main className="bg-site-background min-h-screen flex">
        {/* Left Section - About Me (7/12 of the screen) */}
        <div className="w-7/12 flex items-center justify-center p-10">
          <div>
            <h1 className="manrope-custom text-white" style={{ fontSize: "4rem", fontWeight: "bold", marginTop: "0%" }}>Glance</h1>
            <p className="fira-sans-regular text-white" style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "0%" }}>
              Welcome to my personal page! Here's some information about me...
            </p>
            <Link href="/signIn">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Right Section - Logo Container (5/12 of the screen) */}
        <div className="w-5/12 flex items-center justify-center">
          <div className="bg-site-foreground w-3/4 h-1/2 rounded-lg flex items-center justify-center p-10">
            {/* Logo Image */}
            <Image src={glancePNG} alt="Logo" className="w-full h-auto" />
          </div>
        </div>

      </main>
    </HydrateClient>
  );
}
