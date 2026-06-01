import { NextResponse } from "next/server";
import { isDashboardAuthenticated } from "@/lib/dashboard-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "SUPABASE_SERVICE_ROLE_KEY ontbreekt. Voeg de service role key toe in .env.local / Vercel.",
      },
      { status: 503 }
    );
  }

  const { error, count } = await supabase
    .from("survey_results")
    .delete({ count: "exact" })
    .not("id", "is", null);

  if (error) {
    console.error("Delete survey_results failed:", error);
    return NextResponse.json(
      { error: error.message || "Wissen mislukt" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, deleted: count ?? 0 });
}
