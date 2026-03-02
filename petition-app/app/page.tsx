"use client";

import { useState } from "react";
import PetitionForm from "@/components/PetitionForm";
import PetitionDisplay from "@/components/PetitionDisplay";
import { UserInput, Representative, GeneratedPetition } from "@/lib/types";

type AppState = "form" | "loading" | "results" | "error";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("form");
  const [petitions, setPetitions] = useState<GeneratedPetition[]>([]);
  const [error, setError] = useState<string>("");
  const [loadingStep, setLoadingStep] = useState<string>("");

  const handleSubmit = async (userData: UserInput) => {
    setAppState("loading");
    setError("");

    try {
      // Step 1: Look up representatives
      setLoadingStep("Looking up your congressional representatives...");
      const repResponse = await fetch("/api/representatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: userData.address,
          city: userData.city,
          state: userData.state,
          zip: userData.zip,
        }),
      });

      if (!repResponse.ok) {
        const repError = await repResponse.json();
        throw new Error(repError.error || "Failed to look up representatives.");
      }

      const { representatives }: { representatives: Representative[] } =
        await repResponse.json();

      if (representatives.length === 0) {
        throw new Error(
          "No representatives found for your address. Please verify and try again."
        );
      }

      // Step 2: Generate petitions
      setLoadingStep(
        `Generating ${representatives.length} personalized petition${representatives.length > 1 ? "s" : ""}...`
      );
      const petitionResponse = await fetch("/api/generate-petition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userData,
          representatives,
        }),
      });

      if (!petitionResponse.ok) {
        const petitionError = await petitionResponse.json();
        throw new Error(
          petitionError.error || "Failed to generate petitions."
        );
      }

      const { petitions: generatedPetitions }: { petitions: GeneratedPetition[] } =
        await petitionResponse.json();

      setPetitions(generatedPetitions);
      setAppState("results");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
      setAppState("error");
    }
  };

  const handleReset = () => {
    setAppState("form");
    setPetitions([]);
    setError("");
    setLoadingStep("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Header */}
      <header className="bg-primary-dark text-white no-print">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <h1 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-bold mb-3">
            Petition Your Representatives
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Generate personalized letters to your members of Congress urging
            oversight of the Department of War&apos;s actions against AI safety.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Context Banner */}
        {appState === "form" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-amber-900 mb-2">
              Why This Matters
            </h2>
            <p className="text-amber-800 text-sm leading-relaxed mb-4">
              In February 2026, the Department of War demanded Anthropic remove
              AI safety guardrails to enable autonomous weapons and mass domestic
              surveillance. When Anthropic refused, the administration retaliated
              by blacklisting the company from all federal contracts. This
              petition asks your representatives to exercise their
              constitutional duty of oversight — investigating executive
              overreach, protecting companies that maintain safety standards, and
              ensuring human control over weapons systems.
            </p>

            <details className="group">
              <summary className="cursor-pointer text-sm font-semibold text-amber-900 hover:text-amber-700 transition-colors flex items-center gap-1">
                <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Read the full timeline &amp; source reporting
              </summary>

              <div className="mt-4 space-y-4">
                {/* Timeline */}
                <div className="bg-white/60 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-amber-900 mb-3">Timeline of Events</h3>
                  <ol className="space-y-2 text-sm text-amber-800">
                    <li className="flex gap-3">
                      <span className="font-semibold shrink-0 text-amber-900">Jan 2026</span>
                      <span>Pentagon uses Anthropic&apos;s Claude during capture of Venezuelan president Maduro; DoW re-evaluates Anthropic contracts.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold shrink-0 text-amber-900">Feb 24</span>
                      <span>Defense Secretary Hegseth gives Anthropic CEO Dario Amodei a deadline of 5:01 PM Feb 27 to allow unrestricted military use of Claude, including autonomous weapons and domestic surveillance.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold shrink-0 text-amber-900">Feb 26</span>
                      <span>Anthropic publicly rejects the Pentagon&apos;s &quot;final offer,&quot; stating autonomous weapons are unreliable and mass surveillance is incompatible with democratic values.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold shrink-0 text-amber-900">Feb 27</span>
                      <span>Trump orders all federal agencies to stop using Anthropic products. Hegseth designates Anthropic a &quot;supply chain risk,&quot; blacklisting it from military and contractor work. OpenAI announces deal to replace Anthropic on classified networks.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold shrink-0 text-amber-900">Feb 28</span>
                      <span>GSA removes Anthropic from procurement. Claude hits #1 on the Apple App Store as public rallies behind Anthropic&apos;s stance.</span>
                    </li>
                  </ol>
                </div>

                {/* Key Issues */}
                <div className="bg-white/60 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-amber-900 mb-3">Key Issues for Congress</h3>
                  <ul className="space-y-1.5 text-sm text-amber-800">
                    <li className="flex gap-2"><span className="text-amber-600 shrink-0">1.</span> The DoW demanded AI capable of <strong>killing without human oversight</strong> — fully autonomous lethal weapons systems.</li>
                    <li className="flex gap-2"><span className="text-amber-600 shrink-0">2.</span> The DoW demanded AI for <strong>mass domestic surveillance</strong> of US citizens at scale.</li>
                    <li className="flex gap-2"><span className="text-amber-600 shrink-0">3.</span> When Anthropic refused on ethical grounds, the executive branch <strong>retaliated through procurement bans</strong> — a potential abuse of power.</li>
                    <li className="flex gap-2"><span className="text-amber-600 shrink-0">4.</span> Replacement contracts were awarded to <strong>competitors willing to comply</strong>, incentivizing a race to the bottom on AI safety.</li>
                    <li className="flex gap-2"><span className="text-amber-600 shrink-0">5.</span> Congress has <strong>constitutional oversight authority</strong> over the Department of War that is not being exercised.</li>
                  </ul>
                </div>

                {/* Source Articles */}
                <div className="bg-white/60 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-amber-900 mb-3">Source Reporting</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="https://www.anthropic.com/news/statement-department-of-war" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline font-medium">
                        Anthropic&apos;s Official Statement on the Department of War
                      </a>
                      <span className="text-amber-700"> — Anthropic&apos;s own account of events and their reasoning for refusing.</span>
                    </li>
                    <li>
                      <a href="https://www.npr.org/2026/02/26/nx-s1-5727847/anthropic-defense-hegseth-ai-weapons-surveillance" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline font-medium">
                        Anthropic Refuses Pentagon Demand to Drop AI Safeguards
                      </a>
                      <span className="text-amber-700"> — NPR&apos;s reporting on Anthropic&apos;s rejection of the ultimatum.</span>
                    </li>
                    <li>
                      <a href="https://www.npr.org/2026/02/27/nx-s1-5729118/trump-anthropic-pentagon-openai-ai-weapons-ban" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline font-medium">
                        Trump Orders Agencies to Drop Anthropic After AI Weapons Refusal
                      </a>
                      <span className="text-amber-700"> — NPR on the federal-wide ban and OpenAI replacement deal.</span>
                    </li>
                    <li>
                      <a href="https://www.usnews.com/news/technology/articles/2026-02-28/what-to-know-about-the-clash-between-the-pentagon-and-anthropic-over-militarys-ai-use" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline font-medium">
                        What to Know About the Pentagon-Anthropic Clash
                      </a>
                      <span className="text-amber-700"> — US News comprehensive overview of the dispute.</span>
                    </li>
                    <li>
                      <a href="https://www.pymnts.com/cpi-posts/anthropic-refuses-pentagon-demand-to-drop-ai-safeguards-200-million-contract-at-risk/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline font-medium">
                        $200M Contract at Risk as Anthropic Refuses to Drop Safeguards
                      </a>
                      <span className="text-amber-700"> — PYMNTS on the financial stakes involved.</span>
                    </li>
                    <li>
                      <a href="https://www.lawfaremedia.org/article/scaling-laws--the-pentagon-goes-to-war-with-anthropic" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline font-medium">
                        Scaling Laws: The Pentagon Goes to War With Anthropic
                      </a>
                      <span className="text-amber-700"> — Lawfare legal analysis of the constitutional and procurement issues.</span>
                    </li>
                    <li>
                      <a href="https://thebulletin.org/2026/02/anthropics-showdown-with-the-us-department-of-war-may-literally-mean-life-or-death-for-all-of-us/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline font-medium">
                        Anthropic&apos;s Showdown May Literally Mean Life or Death for All of Us
                      </a>
                      <span className="text-amber-700"> — Bulletin of the Atomic Scientists on the autonomous weapons implications.</span>
                    </li>
                    <li>
                      <a href="https://www.americanprogress.org/article/the-trump-administration-is-trying-to-make-an-example-of-the-ai-giant-anthropic/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline font-medium">
                        The Administration Is Trying to Make an Example of Anthropic
                      </a>
                      <span className="text-amber-700"> — Center for American Progress on the broader policy implications.</span>
                    </li>
                    <li>
                      <a href="https://fedscoop.com/anthropic-claude-dod-federal-agency-fallout-trump-hegseth/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 underline font-medium">
                        Anthropic Federal Agency Fallout
                      </a>
                      <span className="text-amber-700"> — FedScoop on the impact across federal agencies.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </details>
          </div>
        )}

        {/* Form State */}
        {appState === "form" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <PetitionForm onSubmit={handleSubmit} isLoading={false} />
          </div>
        )}

        {/* Loading State */}
        {appState === "loading" && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6">
              <svg
                className="animate-spin h-12 w-12 text-primary"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-700">{loadingStep}</p>
            <p className="text-sm text-gray-500 mt-2">
              This may take a minute as each letter is individually crafted.
            </p>
          </div>
        )}

        {/* Error State */}
        {appState === "error" && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-red-800 mb-2">
                Something went wrong
              </h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results State */}
        {appState === "results" && (
          <div>
            <div className="flex items-center justify-between mb-6 no-print">
              <div>
                <h2 className="text-2xl font-bold text-primary-dark">
                  Your Petitions Are Ready
                </h2>
                <p className="text-gray-600 mt-1">
                  {petitions.length} personalized letter
                  {petitions.length > 1 ? "s" : ""} generated. Print, copy, or
                  mail them to make your voice heard.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
              >
                Start Over
              </button>
            </div>

            <div className="space-y-8">
              {petitions.map((petition, index) => (
                <PetitionDisplay
                  key={index}
                  petition={petition}
                  index={index}
                />
              ))}
            </div>

            {/* General Mailing Tips */}
            <div className="mt-10 bg-primary-dark text-white rounded-xl p-8 no-print">
              <h3 className="text-xl font-bold mb-4">
                Maximize Your Impact
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-blue-200 mb-2">
                    Physical Mail Matters Most
                  </h4>
                  <p className="text-blue-100">
                    Congressional offices weigh physical letters more heavily
                    than emails. A signed, printed letter sent via postal mail
                    carries significantly more weight with your representative.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-200 mb-2">
                    Follow Up
                  </h4>
                  <p className="text-blue-100">
                    Call your representative&apos;s office 1-2 weeks after mailing
                    to confirm receipt and request a response. Ask to speak with
                    the staffer handling defense or technology policy.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-200 mb-2">
                    Share With Others
                  </h4>
                  <p className="text-blue-100">
                    Encourage friends and family to write their own letters.
                    Volume matters — representatives track constituent mail
                    counts on issues and respond to trends.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-200 mb-2">
                    Attend Town Halls
                  </h4>
                  <p className="text-blue-100">
                    Check your representative&apos;s website for upcoming town hall
                    meetings. Raising this issue in person puts it on the public
                    record and gets media attention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16 no-print">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
          <p>
            This tool generates petition letters for civic engagement purposes.
            Petitioning elected representatives is a right protected by the
            First Amendment.
          </p>
          <p className="mt-2">
            Your information is not stored. Letters are generated on-demand and
            are not saved after you leave this page.
          </p>
          <p className="mt-3 text-gray-400 text-xs">
            This is an open source project.{" "}
            <a
              href="https://github.com/anoncam/anthropic-congressional-petition"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-500 transition-colors"
            >
              View source on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
