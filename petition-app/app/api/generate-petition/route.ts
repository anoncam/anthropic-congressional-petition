import { NextResponse } from "next/server";
import { generatePetitions } from "@/lib/claude";
import { UserInput, Representative } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const {
      user,
      representatives,
    }: { user: UserInput; representatives: Representative[] } =
      await request.json();

    if (!user || !representatives || representatives.length === 0) {
      return NextResponse.json(
        { error: "User information and representatives are required." },
        { status: 400 }
      );
    }

    if (!user.name || !user.concerns) {
      return NextResponse.json(
        { error: "Name and concerns are required." },
        { status: 400 }
      );
    }

    const petitions = await generatePetitions(user, representatives);

    return NextResponse.json({ petitions });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate petitions.";
    console.error("Petition generation error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
