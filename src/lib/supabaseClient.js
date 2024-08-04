import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://bwrrikjvegcshdsajvcc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3cnJpa2p2ZWdjc2hkc2FqdmNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI3NzA0MjYsImV4cCI6MjAzODM0NjQyNn0.tEzGCe1htgeY-Hm6bHdXlLVGfUwrC2TRMx99Wp-Atq0')