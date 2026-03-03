"use client";

import { useState, useEffect, useRef } from "react";
import { UserInput } from "@/lib/types";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC","PR","GU","VI","AS","MP",
];

const CONCERN_OPTIONS = [
  {
    id: "autonomous-weapons",
    label: "Autonomous Weapons",
    description: "AI systems that kill without human oversight",
    text: "I am deeply concerned that the Department of War demanded AI systems capable of killing without human oversight. Autonomous lethal weapons remove the moral and legal accountability that must accompany the use of deadly force. No machine should decide who lives and who dies.",
  },
  {
    id: "domestic-surveillance",
    label: "Domestic Surveillance",
    description: "Mass monitoring of American citizens",
    text: "The demand for AI-powered mass surveillance of American citizens is a direct threat to our Fourth Amendment rights. The government should not be building tools to monitor its own people at scale, and should not be punishing companies that refuse to help them do so.",
  },
  {
    id: "retaliation",
    label: "Government Retaliation",
    description: "Punishing a company for ethical refusal",
    text: "The administration's retaliation against Anthropic for refusing to comply with ethically questionable demands sets a dangerous precedent. Using procurement bans and 'supply chain risk' designations as punishment undermines free market principles and chills the entire private sector from exercising ethical judgment.",
  },
  {
    id: "congressional-oversight",
    label: "Congressional Oversight",
    description: "Congress's duty to check executive power",
    text: "Congress has a constitutional duty to oversee the Department of War, and that duty is not being exercised here. The executive branch unilaterally demanded capabilities that raise profound ethical and legal questions — autonomous weapons and mass surveillance — without any Congressional authorization or debate.",
  },
  {
    id: "ai-safety",
    label: "AI Safety Precedent",
    description: "Race to the bottom on safety standards",
    text: "By punishing the one major AI company that maintained safety standards and rewarding competitors willing to remove safeguards, the administration is creating a race to the bottom in AI safety. This endangers not just Americans but people worldwide as these powerful technologies are deployed without adequate guardrails.",
  },
  {
    id: "veteran",
    label: "Veteran Perspective",
    description: "Military service and human accountability",
    text: "As someone with military ties, I understand the value of technological advantage in defense. But autonomous weapons that kill without human decision-making cross a fundamental line. Service members accept the weight of life-and-death decisions — outsourcing that to machines dishonors their sacrifice and removes accountability from warfare.",
  },
];

const TONE_OPTIONS = [
  {
    value: "formal" as const,
    label: "Formal",
    description: "Professional and measured — appropriate for official correspondence",
    example: "\"I write to you as a concerned constituent to respectfully urge your attention to...\"",
  },
  {
    value: "urgent" as const,
    label: "Urgent",
    description: "Time-sensitive and pressing — emphasizes the need for immediate action",
    example: "\"This matter demands your immediate attention. Every day without Congressional action...\"",
  },
  {
    value: "personal" as const,
    label: "Personal",
    description: "Heartfelt and individual — connects your story to the broader issue",
    example: "\"As a parent raising children in this country, I cannot stay silent about...\"",
  },
  {
    value: "factual" as const,
    label: "Factual",
    description: "Evidence-based and precise — leads with documented facts and dates",
    example: "\"On February 24, 2026, Defense Secretary Hegseth issued an ultimatum that...\"",
  },
];

const STEP_LABELS = [
  "Your Info",
  "Concerns",
  "Your Words",
  "Tone",
  "Review",
];

interface PetitionFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

export default function PetitionForm({ onSubmit, isLoading }: PetitionFormProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<UserInput>({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    concerns: "",
    tone: "formal",
  });

  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  const updateField = (field: keyof UserInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const goTo = (target: number) => {
    setDirection(target > step ? "forward" : "back");
    setAnimating(true);
    setTimeout(() => {
      setStep(target);
      setAnimating(false);
    }, 150);
  };

  const next = () => goTo(step + 1);
  const back = () => goTo(step - 1);

  // When moving from step 2 → 3, populate concerns text from selections
  useEffect(() => {
    if (step === 3 && formData.concerns === "") {
      const text = selectedConcerns
        .map((id) => CONCERN_OPTIONS.find((c) => c.id === id)?.text)
        .filter(Boolean)
        .join("\n\n");
      updateField("concerns", text);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleConcern = (id: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  // Validation per step
  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.address && formData.city && formData.state && formData.zip);
      case 2:
        return selectedConcerns.length > 0;
      case 3:
        return formData.concerns.trim().length > 0;
      case 4:
        return !!formData.tone;
      default:
        return true;
    }
  };

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isActive = stepNum === step;
            const isComplete = stepNum < step;
            return (
              <button
                key={label}
                type="button"
                onClick={() => stepNum < step && goTo(stepNum)}
                disabled={stepNum >= step}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  stepNum < step ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-white scale-110"
                      : isComplete
                        ? "bg-primary/20 text-primary"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isComplete ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    isActive ? "text-primary" : isComplete ? "text-primary/60" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / (STEP_LABELS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div
        ref={stepRef}
        className={`transition-all duration-150 ${
          animating
            ? direction === "forward"
              ? "opacity-0 translate-x-4"
              : "opacity-0 -translate-x-4"
            : "opacity-100 translate-x-0"
        }`}
      >
        {/* Step 1: Your Information */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-1">
              First, tell us who you are
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Your name and address identify you as a constituent and determine your representatives.
            </p>

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-primary-dark mb-1">
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

              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-primary-dark mb-1">
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

              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-3">
                  <label htmlFor="city" className="block text-sm font-semibold text-primary-dark mb-1">
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
                  <label htmlFor="state" className="block text-sm font-semibold text-primary-dark mb-1">
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
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label htmlFor="zip" className="block text-sm font-semibold text-primary-dark mb-1">
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
            </div>
          </div>
        )}

        {/* Step 2: What Concerns You */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-1">
              What concerns you most about these events?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Select all that apply. These will shape the focus of your petition letters.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONCERN_OPTIONS.map((concern) => {
                const isSelected = selectedConcerns.includes(concern.id);
                return (
                  <button
                    key={concern.id}
                    type="button"
                    onClick={() => toggleConcern(concern.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-primary-dark">
                          {concern.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {concern.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedConcerns.length > 0 && (
              <p className="text-sm text-primary mt-4 font-medium">
                {selectedConcerns.length} concern{selectedConcerns.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        )}

        {/* Step 3: Personal Perspective */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-1">
              Make it yours
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              We&apos;ve drafted text based on your selections. Edit freely — add personal experiences,
              specific fears, or anything that makes this uniquely yours. Personal letters carry more weight.
            </p>

            <textarea
              id="concerns"
              required
              rows={10}
              value={formData.concerns}
              onChange={(e) => updateField("concerns", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-y text-sm leading-relaxed"
              placeholder="Write your concerns here..."
            />

            <p className="text-xs text-gray-400 mt-2">
              {formData.concerns.trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
        )}

        {/* Step 4: Tone */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-1">
              How should your letter sound?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Choose the tone that best represents how you want to communicate with your representatives.
            </p>

            <div className="space-y-3">
              {TONE_OPTIONS.map((option) => {
                const isSelected = formData.tone === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField("tone", option.value)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "border-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-primary-dark">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {option.description}
                        </div>
                        <div className="text-xs text-gray-400 italic mt-2">
                          {option.example}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-1">
              Review and generate
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Everything look right? Hit generate and we&apos;ll create personalized letters for each of your representatives.
            </p>

            <div className="space-y-4">
              {/* Identity */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-primary-dark">Your Information</h3>
                  <button
                    type="button"
                    onClick={() => goTo(1)}
                    className="text-xs text-primary hover:text-primary-light font-medium"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-700">{formData.name}</p>
                <p className="text-sm text-gray-500">
                  {formData.address}, {formData.city}, {formData.state} {formData.zip}
                </p>
              </div>

              {/* Concerns */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-primary-dark">Your Concerns</h3>
                  <button
                    type="button"
                    onClick={() => goTo(2)}
                    className="text-xs text-primary hover:text-primary-light font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedConcerns.map((id) => {
                    const concern = CONCERN_OPTIONS.find((c) => c.id === id);
                    return (
                      <span
                        key={id}
                        className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
                      >
                        {concern?.label}
                      </span>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {formData.concerns}
                </p>
              </div>

              {/* Tone */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-primary-dark">Letter Tone</h3>
                  <button
                    type="button"
                    onClick={() => goTo(4)}
                    className="text-xs text-primary hover:text-primary-light font-medium"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-700 capitalize">{formData.tone}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
        {step > 1 ? (
          <button
            type="button"
            onClick={back}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button
            type="button"
            onClick={next}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              "Generate My Petitions"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
