import React from "react";
import AuthorizedNavBar from "../_components/authorizedNavBar";
import { HydrateClient } from "~/trpc/server";
import PlaidLink from "../_components/PlaidLink"

const NewPage = () => {
    return (
        <HydrateClient>
            <div className="bg-site-background min-h-screen text-white">
                <PlaidLink />
            </div>
        </HydrateClient>
    );
};

export default NewPage;
