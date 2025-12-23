import { redirect } from "next/navigation";
import { auth } from "@/server/services/auth";
import { headers } from "next/headers";

export default async function Home() {
  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect admin to admin dashboard, everyone else to explore
  if (session && session.user.role === "admin") {
    redirect("/admin/");
  } else {
    redirect("/explore");
  }
}
