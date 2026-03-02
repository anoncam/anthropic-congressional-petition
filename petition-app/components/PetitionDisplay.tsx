"use client";

import { useState } from "react";
import { GeneratedPetition } from "@/lib/types";

interface PetitionDisplayProps {
  petition: GeneratedPetition;
  index: number;
}

export default function PetitionDisplay({
  petition,
  index,
}: PetitionDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showMailing, setShowMailing] = useState(false);

  const { representative, letterContent, mailingInstructions } = petition;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Petition to ${representative.title} ${representative.name}</title>
          <style>
            body {
              font-family: "Times New Roman", serif;
              font-size: 12pt;
              line-height: 1.6;
              max-width: 6.5in;
              margin: 1in auto;
              color: #000;
            }
            @media print {
              body { margin: 0; padding: 1in; }
            }
          </style>
        </head>
        <body>
          ${letterContent.replace(/\n/g, "<br>")}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const partyLabel =
    representative.party === "D"
      ? "Democrat"
      : representative.party === "R"
        ? "Republican"
        : representative.party;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-primary px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">
              {representative.title} {representative.name}
            </h3>
            <p className="text-blue-200 text-sm">
              {partyLabel} — {representative.state}
              {representative.district
                ? `, District ${representative.district}`
                : ""}
            </p>
          </div>
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Letter {index + 1}
          </span>
        </div>

        {/* Contact Links */}
        {(representative.contactForm || representative.url || representative.phone) && (
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-white/20">
            {representative.contactForm && (
              <a
                href={representative.contactForm}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email / Contact Form
              </a>
            )}
            {representative.url && (
              <a
                href={representative.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Official Website
              </a>
            )}
            {representative.phone && (
              <a
                href={`tel:${representative.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {representative.phone}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Letter Content */}
      <div className="p-6">
        <div className="petition-letter bg-parchment rounded-lg p-6 font-serif text-sm leading-relaxed whitespace-pre-wrap border border-gray-200">
          {letterContent}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4 no-print">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Letter
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Letter
          </button>

          <button
            onClick={() => setShowMailing(!showMailing)}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {showMailing ? "Hide" : "Show"} Mailing Instructions
          </button>
        </div>

        {/* Mailing Instructions */}
        {showMailing && (
          <div className="mt-4 bg-cream rounded-lg p-5 border border-amber-200 no-print">
            <h4 className="font-bold text-primary-dark mb-3">
              How to Mail This Letter
            </h4>

            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700 mb-1">
                  Envelope Format:
                </p>
                <pre className="bg-white p-3 rounded border text-xs font-mono whitespace-pre-wrap">
                  {mailingInstructions.envelopeFormat}
                </pre>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2">Tips:</p>
                <ul className="space-y-1">
                  {mailingInstructions.tips.map((tip, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary shrink-0">&#8226;</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {representative.contactForm && (
                <p className="text-gray-600">
                  You can also submit your letter electronically via their{" "}
                  <a
                    href={representative.contactForm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    online contact form
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
