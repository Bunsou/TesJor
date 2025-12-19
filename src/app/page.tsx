import { redirect } from "next/navigation";
import { auth } from "@/server/services/auth";
import { headers } from "next/headers";

export default async function Home() {
  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect based on authentication status
  if (session) {
    redirect("/explore");
  } else {
    redirect("/sign-in");
  }
}
