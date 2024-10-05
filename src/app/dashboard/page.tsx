import React from "react";
import AuthorizedNavBar from "../_components/authorizedNavBar"; 
import { HydrateClient } from "~/trpc/server";
const NewPage = () => {
  return (
    <HydrateClient>
      <div style={{ backgroundColor: "#292464", minHeight: "100vh", color: "#fff", padding: "20px" }}>
      <AuthorizedNavBar>
        
      </AuthorizedNavBar>
    </div>
    </HydrateClient>
  );
};

export default NewPage;
