import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { GoogleSignInButton, DiscordSignInButton} from  "~/app/_components/authButtons";

export default async function SignInPage() {


    return (
        <HydrateClient>
            <div className="bg-site-background min-h-screen text-white w-full flex flex-col items-center justify-center py-2">
                <div className="bg-site-foreground flex flex-col items-center w-1/3 mt-10 p-10 shadow-md rounded-lg">
                    <h1 className="mt-5 mb-4 text-4xl font-bold">Sign In</h1>
                    <GoogleSignInButton/>
                    <DiscordSignInButton/>

                </div>

            </div>
        </HydrateClient>
    );
}
