import { NextResponse } from "next/server";
import {
  createSessionToken,
  DASHBOARD_AUTH_COOKIE,
  getDashboardPassword,
} from "@/lib/dashboard-auth";

export async function POST(request: Request) {
  let password: string;
  try {
    const body = await request.json();
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json(
      { error: "Ongeldig verzoek" },
      { status: 400 }
    );
  }

  if (password !== getDashboardPassword()) {
    return NextResponse.json(
      { error: "Onjuist wachtwoord" },
      { status: 401 }
    );
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DASHBOARD_AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
