export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: number;
          created_at: string | null;
          target: string | null;
          author: string | null;
          message: string | null;
          type: string;
          context: Json | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          target?: string | null;
          author?: string | null;
          message?: string | null;
          type?: string;
          context?: Json | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          target?: string | null;
          author?: string | null;
          message?: string | null;
          type?: string;
          context?: Json | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          expo_push_token: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          expo_push_token?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          expo_push_token?: string | null;
        };
      };
      rentables: {
        Row: {
          id: number;
          created_at: string | null;
          model: string | null;
          type: string | null;
          fuel: string | null;
          seat_count: number | null;
          cost_per_km: number | null;
          cost_per_minute: number | null;
          longitude: number | null;
          latitude: number | null;
          owner: string | null;
          additional_information: string | null;
          picture: string | null;
          license_plate: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          model?: string | null;
          type?: string | null;
          fuel?: string | null;
          seat_count?: number | null;
          cost_per_km?: number | null;
          cost_per_minute?: number | null;
          longitude?: number | null;
          latitude?: number | null;
          owner?: string | null;
          additional_information?: string | null;
          picture?: string | null;
          license_plate?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          model?: string | null;
          type?: string | null;
          fuel?: string | null;
          seat_count?: number | null;
          cost_per_km?: number | null;
          cost_per_minute?: number | null;
          longitude?: number | null;
          latitude?: number | null;
          owner?: string | null;
          additional_information?: string | null;
          picture?: string | null;
          license_plate?: string | null;
        };
      };
      reservations: {
        Row: {
          id: number;
          created_at: string | null;
          rentable: number | null;
          borrower: string | null;
          start: string | null;
          end: string | null;
          status: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          rentable?: number | null;
          borrower?: string | null;
          start?: string | null;
          end?: string | null;
          status?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          rentable?: number | null;
          borrower?: string | null;
          start?: string | null;
          end?: string | null;
          status?: string | null;
        };
      };
      reviews: {
        Row: {
          id: number;
          created_at: string | null;
          target: string | null;
          author: string | null;
          message: string | null;
          rating: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          target?: string | null;
          author?: string | null;
          message?: string | null;
          rating?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          target?: string | null;
          author?: string | null;
          message?: string | null;
          rating?: number | null;
        };
      };
      trusted_parties: {
        Row: {
          id: number;
          created_at: string | null;
          name: string | null;
          owner: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          name?: string | null;
          owner?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          name?: string | null;
          owner?: string | null;
        };
      };
      trusted_party_members: {
        Row: {
          id: number;
          created_at: string | null;
          trusted_party_id: number | null;
          user_id: string | null;
          pending: boolean | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          trusted_party_id?: number | null;
          user_id?: string | null;
          pending?: boolean | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          trusted_party_id?: number | null;
          user_id?: string | null;
          pending?: boolean | null;
        };
      };
      trusted_party_rentables: {
        Row: {
          id: number;
          created_at: string | null;
          trusted_party_id: number | null;
          rentable_id: number | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          trusted_party_id?: number | null;
          rentable_id?: number | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          trusted_party_id?: number | null;
          rentable_id?: number | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      http: {
        Args: { request: unknown };
        Returns: unknown;
      };
      http_delete: {
        Args: { uri: string };
        Returns: unknown;
      };
      http_get: {
        Args: { uri: string };
        Returns: unknown;
      };
      http_head: {
        Args: { uri: string };
        Returns: unknown;
      };
      http_header: {
        Args: { field: string; value: string };
        Returns: unknown;
      };
      http_patch: {
        Args: { uri: string; content: string; content_type: string };
        Returns: unknown;
      };
      http_post: {
        Args: { uri: string; content: string; content_type: string };
        Returns: unknown;
      };
      http_put: {
        Args: { uri: string; content: string; content_type: string };
        Returns: unknown;
      };
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      http_set_curlopt: {
        Args: { curlopt: string; value: string };
        Returns: boolean;
      };
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      urlencode: {
        Args: { string: string };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
