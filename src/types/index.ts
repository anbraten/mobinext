export interface Profile {
  id: string /* primary key */;
  updated_at?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Rentable {
  id: number /* primary key */;
  created_at?: string;
  model?: any; // type unknown;
  type?: any; // type unknown;
  fuel?: any; // type unknown;
  seat_count?: any; // type unknown;
  cost_per_km?: any; // type unknown;
  cost_per_minute?: any; // type unknown;
  longitude?: any; // type unknown;
  latitude?: any; // type unknown;
  owner?: string /* foreign key to profiles.id */;
  street?: any; // type unknown;
  city?: any; // type unknown;
  country?: any; // type unknown;
  additional_infomation?: string;
  picture?: string;
  profiles?: Profile;
}

export interface Message {
  id: number /* primary key */;
  created_at?: string;
  target?: string /* foreign key to profiles.id */;
  author?: string /* foreign key to profiles.id */;
  message?: string;
  profiles?: Profile;
}

export interface Review {
  id: number /* primary key */;
  created_at?: string;
  target?: string /* foreign key to profiles.id */;
  author?: string /* foreign key to profiles.id */;
  message?: string;
  rating?: any; // type unknown;
  profiles?: Profile;
}

export interface Trusted_parties {
  id: number /* primary key */;
  created_at?: string;
  name?: any; // type unknown;
  owner?: string /* foreign key to profiles.id */;
  profiles?: Profile;
}

export interface Reservations {
  id: number /* primary key */;
  created_at?: string;
  rentable?: number /* foreign key to rentables.id */;
  borrower?: string /* foreign key to profiles.id */;
  start?: string;
  end?: string;
  rentables?: Rentable;
  profiles?: Profile;
}

export interface Trusted_party_members {
  id: number /* primary key */;
  created_at?: string;
  trusted_party_id?: number /* foreign key to trusted_parties.id */;
  user_id?: string /* foreign key to profiles.id */;
  trusted_parties?: Trusted_parties;
  profiles?: Profile;
}

export * from "./database.types";
