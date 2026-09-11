import { redirect } from "next/navigation";

// Middleware redirects "/" before this page ever renders.
// This redirect() is a server-side fallback in case middleware is bypassed.
export default function RootPage() {
    redirect("/login");
}
