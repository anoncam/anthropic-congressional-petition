"use client";

import { useState } from "react";
import { UserInput } from "@/lib/types";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC","PR","GU","VI","AS","MP",
];

interface PetitionFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

export default function PetitionForm({ onSubmit, isLoading }: PetitionFormProps) {
  const [formData, setFormData] = useState<UserInput>({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    concerns: "",
    tone: "formal",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (
    field: keyof UserInput,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-primary-dark mb-1"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
          placeholder="Your full legal name"
        />
      </div>

      {/* Address */}
      <div>
        <label
          htmlFor="address"
          className="block text-sm font-semibold text-primary-dark mb-1"
        >
          Street Address
        </label>
        <input
          id="address"
          type="text"
          required
          value={formData.address}
          onChange={(e) => updateField("address", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
          placeholder="123 Main Street"
        />
      </div>

      {/* City, State, Zip */}
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-3">
          <label
            htmlFor="city"
            className="block text-sm font-semibold text-primary-dark mb-1"
          >
            City
          </label>
          <input
            id="city"
            type="text"
            required
            value={formData.city}
            onChange={(e) => updateField("city", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
          />
        </div>
        <div className="col-span-1">
          <label
            htmlFor="state"
            className="block text-sm font-semibold text-primary-dark mb-1"
          >
            State
          </label>
          <select
            id="state"
            required
            value={formData.state}
            onChange={(e) => updateField("state", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors bg-white"
          >
            <option value="">--</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label
            htmlFor="zip"
            className="block text-sm font-semibold text-primary-dark mb-1"
          >
            ZIP Code
          </label>
          <input
            id="zip"
            type="text"
            required
            pattern="[0-9]{5}(-[0-9]{4})?"
            value={formData.zip}
            onChange={(e) => updateField("zip", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            placeholder="12345"
          />
        </div>
      </div>

      {/* Concerns */}
      <div>
        <label
          htmlFor="concerns"
          className="block text-sm font-semibold text-primary-dark mb-1"
        >
          Your Concerns
        </label>
        <p className="text-sm text-gray-500 mb-2">
          Describe what specifically concerns you about the Department of War&apos;s
          actions against Anthropic. Your personal perspective makes each
          petition unique and impactful.
        </p>
        <textarea
          id="concerns"
          required
          rows={5}
          value={formData.concerns}
          onChange={(e) => updateField("concerns", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-y"
          placeholder="Write your concerns here, or click a suggestion below to get started..."
        />

        {/* Concern Suggestions */}
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Click to add a starting point — edit freely after
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              {
                label: "Autonomous weapons",
                text: "I am deeply concerned that the Department of War demanded AI systems capable of killing without human oversight. Autonomous lethal weapons remove the moral and legal accountability that must accompany the use of deadly force. No machine should decide who lives and who dies.",
              },
              {
                label: "Domestic surveillance",
                text: "The demand for AI-powered mass surveillance of American citizens is a direct threat to our Fourth Amendment rights. The government should not be building tools to monitor its own people at scale, and should not be punishing companies that refuse to help them do so.",
              },
              {
                label: "Retaliation & free market",
                text: "The administration's retaliation against Anthropic for refusing to comply with ethically questionable demands sets a dangerous precedent. Using procurement bans and 'supply chain risk' designations as punishment undermines free market principles and chills the entire private sector from exercising ethical judgment.",
              },
              {
                label: "Congressional oversight",
                text: "Congress has a constitutional duty to oversee the Department of War, and that duty is not being exercised here. The executive branch unilaterally demanded capabilities that raise profound ethical and legal questions — autonomous weapons and mass surveillance — without any Congressional authorization or debate.",
              },
              {
                label: "AI safety precedent",
                text: "By punishing the one major AI company that maintained safety standards and rewarding competitors willing to remove safeguards, the administration is creating a race to the bottom in AI safety. This endangers not just Americans but people worldwide as these powerful technologies are deployed without adequate guardrails.",
              },
              {
                label: "Veteran perspective",
                text: "As someone with military ties, I understand the value of technological advantage in defense. But autonomous weapons that kill without human decision-making cross a fundamental line. Service members accept the weight of life-and-death decisions — outsourcing that to machines dishonors their sacrifice and removes accountability from warfare.",
              },
            ].map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                onClick={() => {
                  const current = formData.concerns.trim();
                  const newText = current
                    ? `${current}\n\n${suggestion.text}`
                    : suggestion.text;
                  updateField("concerns", newText);
                }}
                className="px-3 py-1.5 text-xs font-medium bg-primary/5 text-primary border border-primary/20 rounded-full hover:bg-primary/10 hover:border-primary/40 transition-colors"
              >
                + {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tone */}
      <div>
        <label className="block text-sm font-semibold text-primary-dark mb-3">
          Letter Tone
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(
            [
              { value: "formal", label: "Formal", desc: "Professional, measured" },
              { value: "urgent", label: "Urgent", desc: "Time-sensitive, pressing" },
              { value: "personal", label: "Personal", desc: "Heartfelt, individual" },
              { value: "factual", label: "Factual", desc: "Evidence-based, precise" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                formData.tone === option.value
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="tone"
                value={option.value}
                checked={formData.tone === option.value}
                onChange={(e) =>
                  updateField("tone", e.target.value)
                }
                className="sr-only"
              />
              <span className="font-semibold text-sm">{option.label}</span>
              <span className="text-xs text-gray-500 mt-1">{option.desc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <svg
              className="animate-spin h-5 w-5"
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
            Finding Your Representatives &amp; Generating Petitions...
          </span>
        ) : (
          "Generate My Petitions"
        )}
      </button>
    </form>
  );
}
