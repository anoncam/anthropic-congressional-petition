import Anthropic from "@anthropic-ai/sdk";
import { Representative, UserInput, GeneratedPetition } from "./types";

const anthropic = new Anthropic();

function buildPrompt(user: UserInput, rep: Representative): string {
  const repTitle =
    rep.title === "Senator"
      ? `Senator ${rep.name}`
      : `Representative ${rep.name}`;

  const partyContext = rep.party === "D" ? "Democrat" : rep.party === "R" ? "Republican" : rep.party;

  const committeeContext =
    rep.committees.length > 0
      ? `This representative serves on the following committees: ${rep.committees.join(", ")}. Tailor the petition to emphasize their oversight responsibilities through these committee roles.`
      : "";

  const toneInstructions = {
    formal:
      "Write in a formal, professional tone appropriate for official correspondence with an elected official.",
    urgent:
      "Write with a sense of urgency, emphasizing the time-sensitive nature of this matter and the need for immediate action.",
    personal:
      "Write in a personal, heartfelt tone that connects the constituent's individual concerns to the broader issue.",
    factual:
      "Write in a factual, evidence-based tone that emphasizes specific facts, dates, and documented events.",
  };

  return `You are helping a constituent write a petition letter to their elected representative regarding the Department of War's recent actions against Anthropic.

CONTEXT:
In February 2026, the Department of Defense (recently re-designated as the Department of War) demanded that Anthropic remove safety guardrails from its AI models to enable fully autonomous weapons systems and domestic mass surveillance. When Anthropic refused on ethical grounds, the Trump administration:
- Ordered all federal agencies to stop using Anthropic products
- Designated Anthropic a "supply chain risk," blacklisting it from military and contractor work
- Removed Anthropic from GSA procurement
- Awarded replacement contracts to competitors willing to comply

This raises serious concerns about:
1. Executive overreach in retaliating against a private company for maintaining ethical standards
2. The precedent of punishing companies that refuse to build autonomous weapons
3. The push for mass domestic surveillance capabilities in AI systems
4. The integrity of federal procurement processes
5. Congressional oversight authority over the Department of War

CONSTITUENT INFORMATION:
- Name: ${user.name}
- Address: ${user.address}, ${user.city}, ${user.state} ${user.zip}
- Their specific concerns: ${user.concerns}

RECIPIENT:
- ${repTitle} (${partyContext}) from ${rep.state}${rep.district ? `, District ${rep.district}` : ""}
${committeeContext}

INSTRUCTIONS:
${toneInstructions[user.tone]}

Write a petition letter that:
1. Opens with a proper salutation ("Dear ${repTitle}")
2. Identifies the writer as a constituent with their city/state
3. Clearly states the issue regarding the Department of War's actions against Anthropic
4. Incorporates the constituent's specific concerns naturally
5. Makes a specific, actionable request for the representative to:
   - Conduct hearings on the DoW's demands for autonomous weapons and surveillance
   - Investigate potential abuse of procurement authority as retaliation
   - Support legislation protecting companies that maintain AI safety standards
   - Assert Congressional oversight over military AI deployment
6. Closes respectfully with a request for a written response
7. Includes a proper signature block with the constituent's name and address

The letter should be 400-600 words, professional, and specific. Do NOT use generic template language. Make it feel like it was written by a real person with genuine concerns.

Return ONLY the letter text, no additional commentary.`;
}

export async function generatePetition(
  user: UserInput,
  rep: Representative
): Promise<GeneratedPetition> {
  const prompt = buildPrompt(user, rep);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const letterContent =
    message.content[0].type === "text" ? message.content[0].text : "";

  const salutation =
    rep.title === "Senator"
      ? `The Honorable ${rep.name}\nUnited States Senate`
      : `The Honorable ${rep.name}\nUnited States House of Representatives`;

  const mailingInstructions = {
    recipientAddress: rep.officeAddress || `${salutation}\nWashington, DC 20510`,
    salutation: `Dear ${rep.title} ${rep.name}`,
    envelopeFormat: [
      `${user.name}`,
      `${user.address}`,
      `${user.city}, ${user.state} ${user.zip}`,
      "",
      salutation,
      rep.officeAddress || "Washington, DC 20510",
    ].join("\n"),
    tips: [
      "Print on plain white paper and sign by hand for maximum impact.",
      "Use a standard #10 business envelope.",
      `Address the envelope to "${rep.title} ${rep.name}" — never use first names.`,
      "Include your return address so they can respond.",
      "A single first-class stamp ($0.73) is sufficient for a standard letter.",
      "Consider sending via certified mail ($4.85) to ensure delivery confirmation.",
      "Keep a copy of your letter for your records.",
      rep.contactForm
        ? `You can also submit electronically at: ${rep.contactForm}`
        : "Check the representative's website for electronic submission options.",
    ],
  };

  return {
    representative: rep,
    letterContent,
    mailingInstructions,
  };
}

export async function generatePetitions(
  user: UserInput,
  representatives: Representative[]
): Promise<GeneratedPetition[]> {
  const petitions = await Promise.all(
    representatives.map((rep) => generatePetition(user, rep))
  );
  return petitions;
}
