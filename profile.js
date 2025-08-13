// profile.js
// Minimal auth guard and sign-out for the profile page

console.log('Profile.js script loaded!');

const SUPABASE_URL = 'https://uzzhiyjlxjeevtzjokkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6emhpeWpseGplZXZ0empva2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjkyODQsImV4cCI6MjA2OTgwNTI4NH0.8rJx2iP3Cpx0If0cpfuA7MRD0sT56bjMKvQi4qLP-BY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

(async function initProfile() {
  console.log('InitProfile function started');
  
  // Require an authenticated session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('No user found, redirecting to index.html');
    window.location.href = 'index.html';
    return;
  }
  
  console.log('User authenticated:', user.email);

  // Wire up sign out
  const signOutBtn = document.getElementById('signOutBtn');
  signOutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  });

  // Back arrow to Select Profile page
  const backArrow = document.getElementById('backArrow');
  backArrow?.addEventListener('click', () => {
    window.location.href = 'app.html';
  });

  // Load selected profile id (optional)
  const urlParams = new URLSearchParams(window.location.search);
  const idFromQuery = urlParams.get('id');
  const idFromSession = sessionStorage.getItem('selectedProfileId');
  const profileId = idFromQuery || idFromSession || '';
  console.log('Opened profile page for id:', profileId);

  // Theme and Genre card selection
  const themeCards = document.querySelectorAll('.theme-card');
  const genreCards = document.querySelectorAll('.genre-card');

  // Theme card selection (only one can be selected)
  themeCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from all theme cards
      themeCards.forEach(c => c.classList.remove('selected'));
      // Add selected class to clicked card
      card.classList.add('selected');
      console.log('Selected theme:', card.getAttribute('data-theme'));
    });
  });

  // Genre card selection (only one can be selected)
  genreCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from all genre cards
      genreCards.forEach(c => c.classList.remove('selected'));
      // Add selected class to clicked card
      card.classList.add('selected');
      console.log('Selected genre:', card.getAttribute('data-genre'));
    });
  });

  // Generate Story button functionality
  const generateStoryBtn = document.getElementById('generateStoryBtn');
  console.log('Generate Story button found:', generateStoryBtn);
  
  if (generateStoryBtn) {
    generateStoryBtn.addEventListener('click', () => {
      console.log('Generate Story button clicked');
      // Navigate to story generation page
      window.location.href = 'generate-story.html';
    });
    console.log('Generate Story button event listener attached');
  } else {
    console.error('Generate Story button not found!');
    
    // Fallback: Try to find the button after a short delay
    setTimeout(() => {
      const retryBtn = document.getElementById('generateStoryBtn');
      if (retryBtn) {
        console.log('Generate Story button found on retry:', retryBtn);
        retryBtn.addEventListener('click', () => {
          console.log('Generate Story button clicked (retry)');
          window.location.href = 'generate-story.html';
        });
        console.log('Generate Story button event listener attached (retry)');
      } else {
        console.error('Generate Story button still not found after retry!');
      }
    }, 1000);
  }
})();

// Global event listener as backup for dynamically created buttons
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'generateStoryBtn') {
    console.log('Generate Story button clicked (global listener)');
    window.location.href = 'generate-story.html';
  }
});

// Simple test - add click handler immediately when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  const testBtn = document.getElementById('generateStoryBtn');
  if (testBtn) {
    console.log('Found Generate Story button in DOMContentLoaded');
    testBtn.onclick = () => {
      console.log('Generate Story button clicked (DOMContentLoaded handler)');
      window.location.href = 'generate-story.html';
    };
  } else {
    console.error('Generate Story button not found in DOMContentLoaded');
  }
});


