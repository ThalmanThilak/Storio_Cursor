// profile.js
// Minimal auth guard and sign-out for the profile page

const SUPABASE_URL = 'https://uzzhiyjlxjeevtzjokkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6emhpeWpseGplZXZ0empva2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjkyODQsImV4cCI6MjA2OTgwNTI4NH0.8rJx2iP3Cpx0If0cpfuA7MRD0sT56bjMKvQi4qLP-BY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

(async function initProfile() {
  // Require an authenticated session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  // Wire up sign out
  const signOutBtn = document.getElementById('signOutBtnProfile');
  signOutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  });

  // Load selected profile id (optional)
  const urlParams = new URLSearchParams(window.location.search);
  const idFromQuery = urlParams.get('id');
  const idFromSession = sessionStorage.getItem('selectedProfileId');
  const profileId = idFromQuery || idFromSession || '';
  console.log('Opened profile page for id:', profileId);
})();


