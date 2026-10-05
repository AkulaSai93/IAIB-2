import { NextResponse } from "next/server";

/**
 * Find schools near a PIN code, for the school-name type-ahead.
 *
 * Backed by Google Places Text Search, which needs a server-side key:
 * set GOOGLE_MAPS_API_KEY in the environment and enable the Places API
 * for it. The key must stay server-side — that is the only reason this
 * proxy exists.
 *
 * With no key configured the route returns an empty list and says so,
 * and the form falls back to manual entry. Nothing breaks; the type-ahead
 * simply finds nothing until a key exists.
 */
const PLACES =
  "https://maps.googleapis.com/maps/api/place/textsearch/json";

type Place = { name?: string; formatted_address?: string; place_id?: string };

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const pin = params.get("pin")?.trim() ?? "";
  const query = params.get("q")?.trim() ?? "";

  if (!/^\d{6}$/.test(pin)) {
    return NextResponse.json(
      { ok: false, configured: true, results: [], error: "A valid PIN code is required." },
      { status: 400 },
    );
  }

  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return NextResponse.json({
      ok: true,
      configured: false,
      results: [],
      note: "GOOGLE_MAPS_API_KEY is not set; school search is unavailable.",
    });
  }

  const search = new URLSearchParams({
    query: `${query || "school"} school ${pin}`,
    type: "school",
    region: "in",
    key,
  });

  try {
    const reply = await fetch(`${PLACES}?${search}`, {
      next: { revalidate: 3600 },
    });
    if (!reply.ok) throw new Error(`upstream ${reply.status}`);

    const data = (await reply.json()) as { results?: Place[] };
    const results = (data.results ?? [])
      .slice(0, 8)
      .map((p) => ({
        id: p.place_id ?? p.name ?? "",
        name: p.name ?? "",
        address: p.formatted_address ?? "",
      }))
      .filter((p) => p.name);

    return NextResponse.json({ ok: true, configured: true, results });
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, results: [], error: "Search is unavailable right now." },
      { status: 502 },
    );
  }
}
