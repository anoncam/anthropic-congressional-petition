import { GeocodioResult, Representative } from "./types";

const GEOCODIO_API_URL = "https://api.geocod.io/v1.7";

// Committees with oversight authority relevant to the DoW-Anthropic situation
const RELEVANT_COMMITTEES = [
  "armed services",
  "intelligence",
  "oversight",
  "judiciary",
  "commerce",
  "science",
  "appropriations",
  "homeland security",
];

export async function lookupRepresentatives(
  address: string,
  city: string,
  state: string,
  zip: string
): Promise<Representative[]> {
  const apiKey = process.env.GEOCODIO_API_KEY;
  if (!apiKey) {
    throw new Error("GEOCODIO_API_KEY is not configured");
  }

  const fullAddress = `${address}, ${city}, ${state} ${zip}`;
  const encodedAddress = encodeURIComponent(fullAddress);

  const response = await fetch(
    `${GEOCODIO_API_URL}/geocode?q=${encodedAddress}&fields=cd&api_key=${apiKey}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Geocodio API error: ${response.status} - ${errorText}`);
  }

  const data: GeocodioResult = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(
      "Could not find your address. Please check and try again."
    );
  }

  const result = data.results[0];
  const districts = result.fields?.congressional_districts;

  if (!districts || districts.length === 0) {
    throw new Error(
      "Could not determine your congressional district. Please verify your address."
    );
  }

  const district = districts[0];
  const representatives: Representative[] = [];

  for (const legislator of district.current_legislators) {
    const rep: Representative = {
      name: `${legislator.bio.first_name} ${legislator.bio.last_name}`,
      title:
        legislator.type === "senator" ? "Senator" : "Representative",
      party: legislator.bio.party,
      state: state,
      district:
        legislator.type === "representative"
          ? String(district.district_number)
          : undefined,
      phone: legislator.contact.phone,
      url: legislator.contact.url,
      contactForm: legislator.contact.contact_form,
      officeAddress: legislator.contact.address,
      committees: [],
      isRelevantCommittee: false,
    };

    representatives.push(rep);
  }

  return representatives;
}

export function identifyRelevantCommitteeMembers(
  committees: string[]
): boolean {
  return committees.some((committee) =>
    RELEVANT_COMMITTEES.some((relevant) =>
      committee.toLowerCase().includes(relevant)
    )
  );
}
