// app.js
// Initialize Supabase client using CDN (same as index)
const SUPABASE_URL = 'https://uzzhiyjlxjeevtzjokkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6emhpeWpseGplZXZ0empva2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjkyODQsImV4cCI6MjA2OTgwNTI4NH0.8rJx2iP3Cpx0If0cpfuA7MRD0sT56bjMKvQi4qLP-BY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

(async function init() {
  // Guard: redirect to index if no active session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const signOutBtn = document.getElementById('signOutBtn');
  signOutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  });

  // Profile functionality
  const addChildBtn = document.getElementById('addChildBtn');
  const profileListContainer = document.getElementById('profileListContainer');

  // Load existing profiles
  await loadProfiles();

  // Add child button event listener
  addChildBtn?.addEventListener('click', () => {
    // For now, just show an alert. You can implement a modal or redirect to a profile creation page
    alert('Add Child functionality will be implemented next!');
  });
})();

// Function to load and display profiles
async function loadProfiles() {
  const profileListContainer = document.getElementById('profileListContainer');
  
  try {
    // For now, we'll simulate no profiles. Later you can fetch from Supabase
    const profiles = []; // This would come from your database
    
    if (profiles.length === 0) {
      // Show "Add your Child" message
      profileListContainer.innerHTML = `
        <div class="no-profiles-message">
          <p>No child profiles found</p>
          <button class="cta-btn primary" id="addChildBtn">
            <span class="btn-icon">👶</span>
            Add Your Child
          </button>
        </div>
      `;
      
      // Re-attach event listener
      const newAddChildBtn = document.getElementById('addChildBtn');
      newAddChildBtn?.addEventListener('click', () => {
        alert('Add Child functionality will be implemented next!');
      });
    } else {
      // Show profile cards
      displayProfiles(profiles);
    }
  } catch (error) {
    console.error('Error loading profiles:', error);
    // Show error state
    profileListContainer.innerHTML = `
      <div class="no-profiles-message">
        <p>Error loading profiles</p>
        <button class="cta-btn primary" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }
}

// Function to display profile cards
function displayProfiles(profiles) {
  const profileListContainer = document.getElementById('profileListContainer');
  
  const profilesHTML = profiles.map(profile => `
    <div class="profile-card" onclick="selectProfile('${profile.id}')">
      <div class="profile-avatar">${profile.avatar || '👶'}</div>
      <div class="profile-name">${profile.name}</div>
      <div class="profile-age">${profile.age} years old</div>
    </div>
  `).join('');
  
  profileListContainer.innerHTML = `
    <div class="profile-grid">
      ${profilesHTML}
      <div class="profile-card add-profile-card" onclick="addNewProfile()">
        <div class="profile-avatar">➕</div>
        <div class="profile-name">Add New Child</div>
        <div class="profile-age">Create new profile</div>
      </div>
    </div>
  `;
}

// Function to select a profile
function selectProfile(profileId) {
  console.log('Selected profile:', profileId);
  // Implement profile selection logic
  alert(`Selected profile: ${profileId}`);
}

// Function to add new profile
function addNewProfile() {
  alert('Add Child functionality will be implemented next!');
}
