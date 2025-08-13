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
    showAddChildForm();
  });

  // Close form button
  const closeAddChildForm = document.getElementById('closeAddChildForm');
  closeAddChildForm?.addEventListener('click', () => {
    hideAddChildForm();
  });

  // Cancel button
  const cancelBtn = document.getElementById('cancelBtn');
  cancelBtn?.addEventListener('click', () => {
    hideAddChildForm();
  });



  // Form submission
  const childProfileForm = document.getElementById('childProfileForm');
  childProfileForm?.addEventListener('submit', handleChildProfileSubmit);
})();

// Function to load and display profiles
async function loadProfiles() {
  const profileListContainer = document.getElementById('profileListContainer');
  
  try {
    // Get profiles from window object (in a real app, this would come from Supabase)
    const profiles = window.profiles || [];
    
    console.log('Loading profiles:', profiles.length, 'profiles found');
    
    if (profiles.length === 0) {
      // Show "Add your Child" message
      const noProfilesMessage = document.getElementById('noProfilesMessage');
      const addChildForm = document.getElementById('addChildForm');
      
      if (noProfilesMessage) {
        noProfilesMessage.style.display = 'flex';
      }
      if (addChildForm) {
        addChildForm.style.display = 'none';
      }
    } else {
      // Show profile cards
      console.log('Displaying profiles:', profiles);
      displayProfiles(profiles);
    }
  } catch (error) {
    console.error('Error loading profiles:', error);
    // Show error state
    const noProfilesMessage = document.getElementById('noProfilesMessage');
    if (noProfilesMessage) {
      noProfilesMessage.innerHTML = `
        <p>Error loading profiles</p>
        <button class="cta-btn primary" onclick="location.reload()">Try Again</button>
      `;
    }
  }
}

// Function to display profile cards
function displayProfiles(profiles) {
  const profileListContainer = document.getElementById('profileListContainer');
  
  const profilesHTML = profiles.map(profile => `
    <div class="profile-card" onclick="selectProfile('${profile.id}')">
      <div class="profile-avatar">${profile.avatar}</div>
      <div class="profile-name">${profile.name}</div>
      <div class="profile-age">${profile.age} years old</div>
    </div>
  `).join('');
  
  profileListContainer.innerHTML = `
    <div class="profile-grid">
      ${profilesHTML}
    </div>
    <div class="add-child-button-container">
      <button class="cta-btn primary" id="addChildBtn">
        <span class="btn-icon">👶</span>
        Add Your Child
      </button>
    </div>
  `;
  
  // Re-attach event listener for the new button
  const newAddChildBtn = document.getElementById('addChildBtn');
  newAddChildBtn?.addEventListener('click', () => {
    showAddChildForm();
  });
}

// Function to select a profile
function selectProfile(profileId) {
  console.log('Selected profile:', profileId);
  try {
    // Persist selected profile for later use
    sessionStorage.setItem('selectedProfileId', String(profileId));
  } catch (err) {
    console.warn('Unable to persist selected profile id to sessionStorage:', err);
  }
  // Navigate to a new blank page for the profile
  window.location.href = `profile.html?id=${encodeURIComponent(profileId)}`;
}

// Function to show add child form
function showAddChildForm() {
  const noProfilesMessage = document.getElementById('noProfilesMessage');
  const addChildForm = document.getElementById('addChildForm');
  
  if (noProfilesMessage && addChildForm) {
    noProfilesMessage.style.display = 'none';
    addChildForm.style.display = 'block';
  }
}

// Function to hide add child form
function hideAddChildForm() {
  const noProfilesMessage = document.getElementById('noProfilesMessage');
  const addChildForm = document.getElementById('addChildForm');
  
  if (noProfilesMessage && addChildForm) {
    noProfilesMessage.style.display = 'flex';
    addChildForm.style.display = 'none';
    
    // Reset form
    const form = document.getElementById('childProfileForm');
    if (form) {
      form.reset();
    }
  }
}

// Function to handle child profile form submission
async function handleChildProfileSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const childName = formData.get('childName');
  const childGender = formData.get('childGender');
  const childAge = formData.get('childAge');
  const childFavorite = formData.get('childFavorite');
  
  if (!childName || !childGender || !childAge || !childFavorite) {
    alert('Please fill in all required fields');
    return;
  }
  
  try {
    // Create profile object
    const newProfile = {
      id: Date.now().toString(), // Simple ID generation
      name: childName,
      gender: childGender,
      age: childAge,
      favorite: childFavorite,
      avatar: childName.charAt(0).toUpperCase() // First letter as avatar
    };
    
    console.log('Creating profile:', newProfile);
    
    // Add to profiles array (in a real app, this would be saved to database)
    if (!window.profiles) {
      window.profiles = [];
    }
    window.profiles.push(newProfile);
    
    console.log('Total profiles after adding:', window.profiles.length);
    console.log('All profiles:', window.profiles);
    
    hideAddChildForm();
    
    // Refresh the profile display
    await loadProfiles();
    
  } catch (error) {
    console.error('Error creating profile:', error);
    alert('Error creating profile. Please try again.');
  }
}

// Function to add new profile
function addNewProfile() {
  showAddChildForm();
}
