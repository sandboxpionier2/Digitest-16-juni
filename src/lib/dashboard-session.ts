import { cookies } from "next/headers";
import {
  DASHBOARD_AUTH_COOKIE,
  verifySessionToken,
} from "@/lib/dashboard-auth";

export async function isDashboardAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(DASHBOARD_AUTH_COOKIE)?.value;
  return verifySessionToken(token);
}
