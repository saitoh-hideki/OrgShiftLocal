// functions/resolve-link/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { entityType, slug, municipality = "長野市" } = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // 市→県→全国のIDを取得
    const { data: city } = await supabase
      .from("location")
      .select("id, parent_id")
      .eq("municipality", municipality)
      .eq("level", "municipality")
      .single();

    if (!city) return new Response(JSON.stringify({ url: null }), { headers: { "content-type": "application/json" } });

    const prefId = city.parent_id ?? null;

    // エンティティID取得
    const table = entityType === "service" ? "service"
                : entityType === "subsidy" ? "subsidy"
                : entityType === "digital_service" ? "digital_service" : null;

    if (!table) throw new Error("Invalid entityType");

    const { data: entity } = await supabase.from(table).select("id").eq("slug", slug).single();
    if (!entity) return new Response(JSON.stringify({ url: null }), { headers: { "content-type": "application/json" } });

    // 対応リンク表
    const linkTable = `${table}_link`;

    // 優先順：市→県→全国（NULL）
    const { data: links } = await supabase
      .from(linkTable)
      .select("label, url, sort_order, location_id")
      .eq(`${table}_id`, entity.id);

    if (!links || links.length === 0) {
      // primary_url フォールバック（serviceのみ）
      if (table === "service") {
        const { data: s } = await supabase.from("service").select("primary_url").eq("id", entity.id).single();
        return new Response(JSON.stringify({ url: s?.primary_url ?? null }), { headers: { "content-type": "application/json" } });
      }
      return new Response(JSON.stringify({ url: null }), { headers: { "content-type": "application/json" } });
    }

    const best = links.sort((a, b) => {
      const rank = (loc: string | null) =>
        loc === city.id ? 1 : loc === prefId ? 2 : loc === null ? 3 : 4;
      return rank(a.location_id as any) - rank(b.location_id as any) || (a.sort_order - b.sort_order);
    })[0];

    return new Response(JSON.stringify({ url: best.url, label: best.label }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
