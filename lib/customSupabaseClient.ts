import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lqxywygswhflpdvndund.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxeHl3eWdzd2hmbHBkdm5kdW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NjY4NDcsImV4cCI6MjA4MzM0Mjg0N30.OttG3yIt-6SVKi-jmzLHl6gd1nbLhAr2pH4CQhLUt04';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
