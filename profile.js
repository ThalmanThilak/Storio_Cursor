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

  // Voice card selection (only one can be selected)
  const voiceCards = document.querySelectorAll('.voice-card');
  voiceCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from all voice cards
      voiceCards.forEach(c => c.classList.remove('selected'));
      // Add selected class to clicked card
      card.classList.add('selected');
      console.log('Selected voice:', card.getAttribute('data-voice'));
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

  // Load and display saved stories
  function loadSavedStories() {
    let savedStories = JSON.parse(localStorage.getItem('savedStories') || '[]');
    
    // Set dummy stories for testing (always include all three)
    savedStories = [
      'The Magical Adventure of Sia and the Star Catcher',
      'The Brave Little Explorer and the Hidden Treasure',
      'The Enchanted Garden of Dreams'
    ];
    localStorage.setItem('savedStories', JSON.stringify(savedStories));
    localStorage.setItem('savedStoriesUpdated', Date.now().toString());
    
    const savedStoriesContent = document.querySelector('.saved-stories-content');
    
    if (savedStoriesContent) {
      if (savedStories.length === 0) {
        savedStoriesContent.innerHTML = `
          <div style="text-align: center; color: rgba(255, 255, 255, 0.7); font-style: italic;">
            <p>Your saved stories will appear here</p>
            <p style="font-size: 0.9rem; margin-top: 1rem;">Stories you save with the heart button will be displayed in this section</p>
          </div>
        `;
      } else {
        const storiesList = savedStories.map(story => `
          <div style="display: flex; align-items: center; margin-bottom: 1rem; padding: 0.5rem 0; cursor: pointer; transition: all 0.3s ease; border-radius: 8px;" 
               onmouseover="this.style.background='rgba(0, 191, 255, 0.1)'; this.style.boxShadow='0 0 15px rgba(0, 191, 255, 0.3)'; this.style.transform='translateY(-2px)'" 
               onmouseout="this.style.background='transparent'; this.style.boxShadow='none'; this.style.transform='translateY(0)'" 
               onclick="navigateToStory('${story}')">
            <span style="color: #ff0000; font-size: 1.2rem; margin-right: 0.8rem;">❤️</span>
            <span style="color: #ffffff; font-size: 1rem;">${story}</span>
          </div>
        `).join('');
        
        savedStoriesContent.innerHTML = storiesList;
      }
    }
  }

  // Function to navigate to story page
  window.navigateToStory = function(storyTitle) {
    console.log('Navigating to story:', storyTitle);
    // Store the selected story title in sessionStorage for the story page to use
    sessionStorage.setItem('selectedStoryTitle', storyTitle);
    // Navigate to the story generation page
    window.location.href = 'generate-story.html';
  };

  // Load saved stories when page loads
  loadSavedStories();
  
  // Check for saved stories updates when page becomes visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      loadSavedStories();
    }
  });
  
  // Also check when page gains focus (for better compatibility)
  window.addEventListener('focus', () => {
    loadSavedStories();
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
    
    // Load saved stories when DOM is ready
    loadSavedStories();
  });


