import { createClient } from '@supabase/supabase-js'



const SUPABASE_URL = 'https://prnyckkpngvdhmvrsacd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBybnlja2twbmd2ZGhtdnJzYWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEyNTUyMTksImV4cCI6MjAwNjgzMTIxOX0.VK7btRaCoK8e2joB4XuhbkxgiL5isZuinK3ZzcLxqG4';


export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY,{ db: { schema: 'public' }})