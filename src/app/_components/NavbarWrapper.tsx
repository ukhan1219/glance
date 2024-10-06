import { getServerAuthSession } from "~/server/auth";
import NotAuthorizedNavBar from "./notauthorizedNavBar";

export default async function NavbarWrapper() {
  // Fetch the session on the server-side
  const session = await getServerAuthSession();

  // Pass the session down as a prop
  return <NotAuthorizedNavBar session={session} />;
}

