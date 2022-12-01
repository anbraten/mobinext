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
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          target?: string | null;
          author?: string | null;
          message?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          target?: string | null;
          author?: string | null;
          message?: string | null;
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
          additional_infomation: string | null;
          picture: string | null;
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
          additional_infomation?: string | null;
          picture?: string | null;
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
          additional_infomation?: string | null;
          picture?: string | null;
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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
