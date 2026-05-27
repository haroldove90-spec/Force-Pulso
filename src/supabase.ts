import { createClient } from '@supabase/supabase-js';

// Setup Supabase Client with direct fallback for rapid client review
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://wtdfablkygvqdknegekr.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZGZhYmxreWd2cWRrbmVnZWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTk4NDUsImV4cCI6MjA5NTQ3NTg0NX0.QRYjjhWJNHc7f6OBXytsaq-9Q2shFU07oJe-JZVVWZs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
