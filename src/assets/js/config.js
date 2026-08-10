/**
 * ============================================
 * CONFIGURATIE - SUPABASE
 * ============================================
 */

const SUPABASE_CONFIG = {
    URL: 'https://jbjkkulikpubikkbbqdc.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiamtrdWxpa3B1Ymlra2JicWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMjM3OTQsImV4cCI6MjEwMTg5OTc5NH0.LMuv1NaQKIzMvlik2RMS-FdZf3CqJDKAf4d_xeQPXMU'
};

// Maak het beschikbaar voor andere scripts
window.SUPABASE_CONFIG = SUPABASE_CONFIG;

console.log('✅ Supabase configuratie geladen');
console.log('📍 URL:', SUPABASE_CONFIG.URL);
console.log('🔑 Key (eerste 20 chars):', SUPABASE_CONFIG.ANON_KEY.substring(0, 20) + '...');