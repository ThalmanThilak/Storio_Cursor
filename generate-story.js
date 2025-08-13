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

  // Heart Save button - toggle functionality
  const heartSaveBtn = document.getElementById('heartSaveBtn');
  heartSaveBtn?.addEventListener('click', () => {
    console.log('Heart save button clicked');
    
    // Get the story title
    const storyTitle = document.querySelector('.section-heading').textContent;
    
    // Get current saved stories
    const savedStories = JSON.parse(localStorage.getItem('savedStories') || '[]');
    
    // Check if story is already saved
    const isAlreadySaved = savedStories.includes(storyTitle);
    
    if (isAlreadySaved) {
      // Remove story from saved list
      const updatedStories = savedStories.filter(story => story !== storyTitle);
      localStorage.setItem('savedStories', JSON.stringify(updatedStories));
      localStorage.setItem('savedStoriesUpdated', Date.now().toString());
      
      // Update heart appearance to unsaved
      heartSaveBtn.textContent = '🤍';
      heartSaveBtn.classList.remove('saved');
      
      console.log('Story removed from favorites:', storyTitle);
    } else {
      // Add story to saved list
      savedStories.push(storyTitle);
      localStorage.setItem('savedStories', JSON.stringify(savedStories));
      localStorage.setItem('savedStoriesUpdated', Date.now().toString());
      
      // Update heart appearance to saved
      heartSaveBtn.textContent = '❤️';
      heartSaveBtn.classList.add('saved');
      
      console.log('Story saved to favorites:', storyTitle);
    }
  });

  // Check if current story is saved and set heart state accordingly
  const currentStoryTitle = document.querySelector('.section-heading')?.textContent;
  if (currentStoryTitle && heartSaveBtn) {
    const savedStories = JSON.parse(localStorage.getItem('savedStories') || '[]');
    const isSaved = savedStories.includes(currentStoryTitle);
    
    if (isSaved) {
      heartSaveBtn.textContent = '❤️';
      heartSaveBtn.classList.add('saved');
    } else {
      heartSaveBtn.textContent = '🤍';
      heartSaveBtn.classList.remove('saved');
    }
  }

  // Check if there's a selected story title from saved stories
  const selectedStoryTitle = sessionStorage.getItem('selectedStoryTitle');
  if (selectedStoryTitle) {
    // Update the story title on the page
    const storyTitleElement = document.querySelector('.section-heading');
    if (storyTitleElement) {
      storyTitleElement.textContent = selectedStoryTitle;
    }
    
    // Update heart button to show as saved
    if (heartSaveBtn) {
      heartSaveBtn.textContent = '❤️';
      heartSaveBtn.classList.add('saved');
    }
    
    // Clear the selected story title from sessionStorage
    sessionStorage.removeItem('selectedStoryTitle');
    
    console.log('Loaded saved story:', selectedStoryTitle);
  }

  // Simulate story generation (placeholder)
  console.log('Story generation page loaded successfully');
})();
