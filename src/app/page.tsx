import { redirect } from "next/navigation";

export default function Home() {
  // This function throws an error that Next.js catches to handle the redirect
  redirect("/explore");

  // You don't need to return anything because the redirect happens immediately
}
