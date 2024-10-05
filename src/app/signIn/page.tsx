import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { GoogleSignInButton } from  "~/app/_components/GoogleSignInButton";
import { DiscordSignInButton } from  "~/app/_components/DiscordSignInButton";
import { signIn, signOut, useSession } from "next-auth/react"

export default async function SignInPage() {


    return (
        <HydrateClient>
            <div className="bg-site-background min-h-screen">
            </div>
        </HydrateClient>
    );
}
