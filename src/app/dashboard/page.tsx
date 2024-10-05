import React from "react";
import AuthorizedNavBar from "../_components/authorizedNavBar";
import { HydrateClient } from "~/trpc/server";
const NewPage = () => {
  return (
    <HydrateClient>
      <div className="bg-site-background min-h-screen text-white">
        <AuthorizedNavBar>

        </AuthorizedNavBar>
      </div>
    </HydrateClient>
  );
};

export default NewPage;
