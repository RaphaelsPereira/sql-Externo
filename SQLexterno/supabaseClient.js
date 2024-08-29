// supabaseClient.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ebmrokypzelpuuqttigx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVibXJva3lwemVscHV1cXR0aWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMTc0NzEsImV4cCI6MjAzODY5MzQ3MX0.1Xj3bLqmPx_qcfkKix3zdAmAVg7kuo1pPIH1O6scktg'; 

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  localStorage: AsyncStorage,
  detectSessionInUrl: false,
});
