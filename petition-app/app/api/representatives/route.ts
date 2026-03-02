import { NextResponse } from "next/server";
import { lookupRepresentatives } from "@/lib/geocodio";

export async function POST(request: Request) {
  try {
    const { address, city, state, zip } = await request.json();

    if (!address || !city || !state || !zip) {
      return NextResponse.json(
        { error: "Address, city, state, and zip are required." },
        { status: 400 }
      );
    }

    const representatives = await lookupRepresentatives(
      address,
      city,
      state,
      zip
    );

    return NextResponse.json({ representatives });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to look up representatives.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
