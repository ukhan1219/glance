

import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { GoogleSignInButton, DiscordSignInButton } from "~/app/_components/authButtons";
import { redirect } from "next/navigation";

export default async function SignInPage() {
    const session = await getServerAuthSession();

    // If already signed in, redirect to preDash to continue session check
    if (session) {
        redirect("/preDash");
    }

    return (
        <HydrateClient>
            <div className="bg-site-background min-h-screen text-white w-full flex flex-col items-center justify-center py-2">
                <div className="bg-site-foreground flex flex-col items-center w-1/3 mt-10 p-10 shadow-md rounded-lg">
                    <h1 className="manrope-custom mt-5 mb-4 font-bold" style={{ fontSize: "4rem", fontWeight: "bold", marginTop: "0%" }}>Sign In</h1>
                    {/* Pass the callbackUrl to redirect back to preDash after successful sign-in */}
                    <GoogleSignInButton callbackUrl="/preDash" />
                    <DiscordSignInButton callbackUrl="/preDash" />
                </div>
            </div>
        </HydrateClient>
    );
}
