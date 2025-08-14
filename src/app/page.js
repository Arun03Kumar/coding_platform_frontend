import { redirect } from "next/navigation";

export default function Home() {
  // temporary: redirect root to /problems
  redirect("/problems");
}
