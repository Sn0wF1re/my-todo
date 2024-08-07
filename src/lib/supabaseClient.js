import { createClient } from '@supabase/supabase-js'

const supabase_url = 'https://bwrrikjvegcshdsajvcc.supabase.co';
const supabase_key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabase_url, supabase_key);