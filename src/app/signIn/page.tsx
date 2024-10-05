import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {


  return (
    <HydrateClient>
      <div>

      </div>
    </HydrateClient>
  );
}
