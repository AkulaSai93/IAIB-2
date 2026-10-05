import { NextResponse } from "next/server";

/**
 * Resolve an Indian PIN code to its city and state.
 *
 * Uses India Post's public, keyless lookup. It is a third-party service, so
 * if the organisers would rather not depend on it, swap the fetch below for
 * an internal endpoint or a bundled PIN table — the response shape this
 * route returns is all the form consumes.
 */
const SOURCE = "https://api.postalpincode.in/pincode";

type PostOffice = { District?: string; State?: string; Block?: string };
type IndiaPostReply = { Status?: string; PostOffice?: PostOffice[] | null };

export async function GET(request: Request) {
  const pin = new URL(request.url).searchParams.get("pin")?.trim() ?? "";

  if (!/^\d{6}$/.test(pin)) {
    return NextResponse.json(
      { ok: false, error: "Enter a 6-digit PIN code." },
      { status: 400 },
    );
  }

  try {
    const reply = await fetch(`${SOURCE}/${pin}`, {
      // PIN data barely changes; let the platform cache it for a day
      next: { revalidate: 86400 },
    });
    if (!reply.ok) throw new Error(`upstream ${reply.status}`);

    const data = (await reply.json()) as IndiaPostReply[];
    const office = data?.[0]?.PostOffice?.[0];

    if (data?.[0]?.Status !== "Success" || !office?.District || !office?.State) {
      return NextResponse.json(
        { ok: false, error: "We couldn't find that PIN code." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      pin,
      city: office.District,
      state: office.State,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Couldn't look that up right now. Try again." },
      { status: 502 },
    );
  }
}
