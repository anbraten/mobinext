import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://eqvwmrnfrxzijtrfuwnf.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxdndtcm5mcnh6aWp0cmZ1d25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg2MTI5ODYsImV4cCI6MTk4NDE4ODk4Nn0.QfV1NvymTLGziQAzVwmaGnOE0Ma-FaF0bj5wqkqadaE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
