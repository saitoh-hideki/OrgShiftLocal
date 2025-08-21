// functions/digital-services/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const url = new URL(req.url);
  const channel = url.searchParams.get("channel") ?? ""; // LINE/iOS/Android/Web
  const q = url.searchParams.get("q") ?? "";
  const municipality = url.searchParams.get("municipality") ?? "長野市";
  const page = Number(url.searchParams.get("page") ?? "1");
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "20"), 50);
  const offset = (page - 1) * limit;

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);

  const { data: city } = await supabase
    .from("location").select("id")
    .eq("municipality", municipality).eq("level", "municipality").single();

  let query = supabase
    .from("digital_service")
    .select("id, slug, title_ja, summary_ja, channel_type, add_friend_url, service_url, app_store_url, play_store_url, popularity", { count: "exact" })
    .eq("is_published", true)
    .eq("location_id", city?.id);

  if (channel) query = query.eq("channel_type", channel);
  if (q) query = query.ilike("title_ja", `%${q}%`);

  query = query.order("popularity", { ascending: false }).range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) return new Response(JSON.stringify({ error }), { status: 500 });

  return new Response(JSON.stringify({ items: data ?? [], page, total: count ?? 0 }), {
    headers: { "content-type": "application/json" },
  });
});
