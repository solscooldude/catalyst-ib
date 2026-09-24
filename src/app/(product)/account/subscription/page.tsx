import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

/** Future billing stub — no live subscribe UI. */
export default function SubscriptionPage() {
  redirect(ROUTES.settings);
}
