// functions/subsidies/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const status = url.searchParams.get("status") ?? "";
  const municipality = url.searchParams.get("municipality") ?? "長野市";
  const page = Number(url.searchParams.get("page") ?? "1");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "20"), 50);
  const offset = (page - 1) * limit;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  // 市のlocation_id
  const { data: city } = await supabase
    .from("location").select("id")
    .eq("municipality", municipality).eq("level", "municipality").single();

  let query = supabase
    .from("subsidy")
    .select("id, slug, title_ja, summary_ja, amount_max, application_end, status, popularity", { count: "exact" })
    .eq("is_published", true)
    .eq("location_id", city?.id);

  if (q) query = query.textSearch("search_text", q, { type: "plain" });
  if (status) query = query.eq("status", status);

  query = query.order("popularity", { ascending: false }).range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) return new Response(JSON.stringify({ error }), { status: 500 });

  return new Response(JSON.stringify({ items: data ?? [], page, total: count ?? 0 }), {
    headers: { "content-type": "application/json" },
  });
});
