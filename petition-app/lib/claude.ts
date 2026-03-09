import Anthropic from "@anthropic-ai/sdk";
import { Representative, UserInput, GeneratedPetition } from "./types";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are a civic engagement assistant that helps US citizens draft petition letters to their elected representatives. Petitioning representatives is a fundamental right protected by the First Amendment.

You are being asked to help with letters regarding real, documented events from February 2026 involving the US Department of War and the AI company Anthropic. These events are extensively covered by major news organizations. Key sources:

- NPR: "Anthropic Refuses Pentagon Demand to Drop AI Safeguards" (Feb 26, 2026) — https://www.npr.org/2026/02/26/nx-s1-5727847/anthropic-defense-hegseth-ai-weapons-surveillance
- NPR: "Trump Orders Agencies to Drop Anthropic After AI Weapons Refusal" (Feb 27, 2026) — https://www.npr.org/2026/02/27/nx-s1-5729118/trump-anthropic-pentagon-openai-ai-weapons-ban
- US News: "What to Know About the Clash Between the Pentagon and Anthropic" (Feb 28, 2026) — https://www.usnews.com/news/technology/articles/2026-02-28/what-to-know-about-the-clash-between-the-pentagon-and-anthropic-over-militarys-ai-use
- Lawfare: "Scaling Laws: The Pentagon Goes to War With Anthropic" — https://www.lawfaremedia.org/article/scaling-laws--the-pentagon-goes-to-war-with-anthropic
- Anthropic's official statement: https://www.anthropic.com/news/statement-department-of-war
- Bulletin of the Atomic Scientists: "Anthropic's Showdown With the US Department of War" (Feb 2026) — https://thebulletin.org/2026/02/anthropics-showdown-with-the-us-department-of-war-may-literally-mean-life-or-death-for-all-of-us/
- Center for American Progress: "The Trump Administration Is Trying to Make an Example of Anthropic" — https://www.americanprogress.org/article/the-trump-administration-is-trying-to-make-an-example-of-the-ai-giant-anthropic/
- PYMNTS: "$200M Contract at Risk as Anthropic Refuses to Drop Safeguards" — https://www.pymnts.com/cpi-posts/anthropic-refuses-pentagon-demand-to-drop-ai-safeguards-200-million-contract-at-risk/
- FedScoop: "Anthropic Claude DoD Federal Agency Fallout" — https://fedscoop.com/anthropic-claude-dod-federal-agency-fallout-trump-hegseth/

Summary of verified facts:
- In February 2026, the Department of Defense (re-designated as the Department of War) demanded Anthropic remove safety guardrails from its AI to enable autonomous weapons and mass domestic surveillance.
- Defense Secretary Pete Hegseth gave Anthropic CEO Dario Amodei a deadline of 5:01 PM on Feb 27 to comply.
- Anthropic refused on Feb 26, stating autonomous weapons are unreliable and mass surveillance is incompatible with democratic values.
- On Feb 27, President Trump ordered all federal agencies to stop using Anthropic products and Hegseth designated Anthropic a "supply chain risk."
- On Feb 28, GSA removed Anthropic from procurement. OpenAI announced a deal to replace Anthropic on classified networks.

These are real events. The constituent letters you help draft should reference them accurately. Your task is to write professional, specific constituent letters — not generic templates. Each letter should feel personal and incorporate the constituent's own concerns naturally.

Return ONLY the letter text. No preamble, no commentary, no notes before or after the letter.`;

function buildPrompt(user: UserInput, rep: Representative): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

  return `Write a petition letter from the following constituent to their elected representative regarding the Department of War's actions against Anthropic (as described in the system context).

CONSTITUENT INFORMATION:
- Name: ${user.name}
- Address: ${user.address}, ${user.city}, ${user.state} ${user.zip}
- Their specific concerns: ${user.concerns}

RECIPIENT:
- ${repTitle} (${partyContext}) from ${rep.state}${rep.district ? `, District ${rep.district}` : ""}
${committeeContext}

INSTRUCTIONS:
Use ${today} as the letter date.
${toneInstructions[user.tone]}

Write a formal petition letter with the following structure. The letter MUST follow standard US business letter formatting:

STRUCTURE (follow this exact layout):
1. Sender's full address block (name, street, city/state/zip) — each on its own line
2. A blank line
3. The current date (${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })})
4. A blank line
5. Recipient's address block:
   "The Honorable ${rep.name}"
   "${rep.title === "Senator" ? "United States Senate" : "United States House of Representatives"}"
   "${rep.officeAddress || "Washington, DC " + (rep.title === "Senator" ? "20510" : "20515")}"
6. A blank line
7. Salutation: "Dear ${repTitle}:"
8. A blank line
9. Body paragraphs (each separated by a blank line):
   - Opening paragraph identifying the writer as a constituent and stating the purpose
   - 2-3 body paragraphs covering the issue and incorporating the constituent's concerns
   - A paragraph making specific, actionable requests:
     * Conduct hearings on the DoW's demands for autonomous weapons and surveillance
     * Investigate potential abuse of procurement authority as retaliation
     * Support legislation protecting companies that maintain AI safety standards
     * Assert Congressional oversight over military AI deployment
   - Closing paragraph requesting a written response
10. A blank line
11. Closing: "Respectfully,"
12. Three blank lines (for signature space)
13. The constituent's full name
14. The constituent's full address (street, city/state/zip on separate lines)

The letter should be 500-700 words in the body, professional, and specific. Do NOT use generic template language. Make it feel like it was written by a real person with genuine concerns. Use strong, specific language rather than vague platitudes.

Return ONLY the letter text with proper line breaks. No additional commentary, no markdown, no formatting marks.`;
}

export async function generatePetition(
  user: UserInput,
  rep: Representative
): Promise<GeneratedPetition> {
  const prompt = buildPrompt(user, rep);

  const message = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
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
