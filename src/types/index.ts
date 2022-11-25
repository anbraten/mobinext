import { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type User = Profile;

export type Rentable = Database["public"]["Tables"]["rentables"]["Row"];

export type Message = Database["public"]["Tables"]["messages"]["Row"];

export type Review = Database["public"]["Tables"]["reviews"]["Row"];

export type Trusted_parties =
  Database["public"]["Tables"]["trusted_parties"]["Row"];

export type Reservations = Database["public"]["Tables"]["reservations"]["Row"];

export type Trusted_party_members =
  Database["public"]["Tables"]["trusted_party_members"]["Row"];

export * from "./database.types";
