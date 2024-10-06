// src/app/preDash/page.tsx
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function PreDashPage() {
  // Fetch the session on the server-side
  const session = await getServerAuthSession();

  // If the user is authenticated, redirect to the dashboard
  if (session) {
    redirect("/dashboard");
  }

  
  // If the user is not authenticated, redirect to the sign-in page
  redirect("/signIn?callbackUrl=/preDash");

  return null;
}
