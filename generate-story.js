// generate-story.js
// Auth guard and functionality for the story generation page

const SUPABASE_URL = 'https://uzzhiyjlxjeevtzjokkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6emhpeWpseGplZXZ0empva2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjkyODQsImV4cCI6MjA2OTgwNTI4NH0.8rJx2iP3Cpx0If0cpfuA7MRD0sT56bjMKvQi4qLP-BY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

(async function initGenerateStory() {
  // Require an authenticated session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  // Wire up sign out
  const signOutBtn = document.getElementById('signOutBtn');
  signOutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  });

  // Back arrow to Story Settings page
  const backArrow = document.getElementById('backArrow');
  backArrow?.addEventListener('click', () => {
    window.location.href = 'profile.html';
  });

  // Load selected profile id (optional)
  const urlParams = new URLSearchParams(window.location.search);
  const idFromQuery = urlParams.get('id');
  const idFromSession = sessionStorage.getItem('selectedProfileId');
  const profileId = idFromQuery || idFromSession || '';
  console.log('Generating story for profile id:', profileId);

  // Try New Story button
  const regenerateStoryBtn = document.getElementById('regenerateStoryBtn');
  regenerateStoryBtn?.addEventListener('click', () => {
    console.log('Try New Story button clicked');
    // Navigate back to profile page to create a new story
    window.location.href = 'profile.html';
  });

  // Heart Save button
  const heartSaveBtn = document.getElementById('heartSaveBtn');
  heartSaveBtn?.addEventListener('click', () => {
    console.log('Heart save button clicked');
    heartSaveBtn.classList.add('saved');
    heartSaveBtn.textContent = '❤️';
    
    // Save story logic here
    console.log('Story saved to favorites!');
    
    // Optional: Show a brief confirmation
    setTimeout(() => {
      heartSaveBtn.classList.remove('saved');
    }, 600);
  });

  // Simulate story generation (placeholder)
  console.log('Story generation page loaded successfully');
})();
