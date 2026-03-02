export interface UserInput {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  concerns: string;
  tone: "formal" | "urgent" | "personal" | "factual";
}

export interface Representative {
  name: string;
  title: "Senator" | "Representative";
  party: string;
  state: string;
  district?: string;
  phone?: string;
  url?: string;
  contactForm?: string;
  officeAddress: string;
  committees: string[];
  isRelevantCommittee: boolean;
}

export interface GeocodioResult {
  results: Array<{
    formatted_address: string;
    fields: {
      congressional_districts?: Array<{
        name: string;
        district_number: number;
        congress_number: string;
        current_legislators: Array<{
          type: "senator" | "representative";
          bio: {
            last_name: string;
            first_name: string;
            party: string;
          };
          contact: {
            url: string;
            address: string;
            phone: string;
            contact_form?: string;
          };
          references: {
            bioguide_id: string;
          };
        }>;
      }>;
    };
  }>;
}

export interface GeneratedPetition {
  representative: Representative;
  letterContent: string;
  mailingInstructions: MailingInstructions;
}

export interface MailingInstructions {
  recipientAddress: string;
  salutation: string;
  envelopeFormat: string;
  tips: string[];
}
