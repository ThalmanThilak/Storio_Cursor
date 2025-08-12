// script.js
// Initialize Supabase client using CDN
const SUPABASE_URL = 'https://uzzhiyjlxjeevtzjokkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6emhpeWpseGplZXZ0empva2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjkyODQsImV4cCI6MjA2OTgwNTI4NH0.8rJx2iP3Cpx0If0cpfuA7MRD0sT56bjMKvQi4qLP-BY';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized for STORIO project:', SUPABASE_URL);

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Check if Supabase is loaded
    if (typeof supabase === 'undefined') {
        console.error('Supabase client not loaded. Please check your configuration.');
        return;
    }

    console.log('Supabase client loaded successfully:', supabase);

    // Add smooth scrolling to all buttons
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add parallax effect to floating elements
    const elements = document.querySelectorAll('.element');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        elements.forEach((element, index) => {
            element.style.transform = `translateY(${rate + (index * 10)}px)`;
        });
    });

    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }

    // Add glow effect to buttons on hover
    const ctaButtons = document.querySelectorAll('.cta-btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 40px rgba(255, 20, 147, 0.8)';
        });
        
        button.addEventListener('mouseleave', function() {
            if (this.classList.contains('primary')) {
                this.style.boxShadow = '0 0 25px rgba(255, 20, 147, 0.4)';
            } else {
                this.style.boxShadow = '0 0 20px rgba(0, 191, 255, 0.3)';
            }
        });
    });

    // Add scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .cta-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Supabase Authentication Functions
    async function signUpWithEmail(email, password, fullName) {
        try {
            console.log('Attempting to sign up user:', email);
            
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (error) {
                console.error('Sign up error:', error);
                throw error;
            }

            console.log('Sign up successful:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Sign up error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async function signInWithEmail(email, password) {
        try {
            console.log('Attempting to sign in user:', email);
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error('Sign in error:', error);
                throw error;
            }

            console.log('Sign in successful:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error.message);
            return { success: false, error: error.message };
        }
    }

    async function signInWithGoogle() {
        try {
            console.log('Attempting Google sign in...');
            
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });

            if (error) {
                console.error('Google sign in error:', error);
                throw error;
            }

            console.log('Google sign in initiated:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Google sign in error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Check if user is already signed in
    async function checkCurrentUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) {
                console.error('Error checking current user:', error);
                return null;
            }
            
            if (user) {
                console.log('User is already signed in:', user.email);
                return user;
            }
            
            return null;
        } catch (error) {
            console.error('Error checking current user:', error);
            return null;
        }
    }

    // Popup functionality
    const signInPopup = document.getElementById('signInPopup');
    const signUpPopup = document.getElementById('signUpPopup');
    const signInBtn = document.querySelector('.cta-btn.primary');
    const signUpBtn = document.querySelector('.cta-btn.secondary');
    const closeSignInPopup = document.getElementById('closeSignInPopup');
    const closeSignUpPopup = document.getElementById('closeSignUpPopup');
    const switchToSignUp = document.getElementById('switchToSignUp');
    const switchToSignIn = document.getElementById('switchToSignIn');

    // Function to close all popups
    function closeAllPopups() {
        signInPopup.classList.remove('active');
        signUpPopup.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Function to open popup
    function openPopup(popup) {
        closeAllPopups();
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Function to update UI after successful authentication
    function updateUIAfterAuth(user) {
        // Update the Sign In button to show user info
        const signInBtn = document.querySelector('.cta-btn.primary');
        signInBtn.textContent = `Welcome, ${user.user_metadata?.full_name || user.email}`;
        signInBtn.style.background = 'linear-gradient(45deg, #00bfff, #ff1493)';
        
        // Update the Sign Up button to show Sign Out
        const signUpBtn = document.querySelector('.cta-btn.secondary');
        signUpBtn.textContent = 'Sign Out';
        signUpBtn.onclick = async () => {
            await supabase.auth.signOut();
            location.reload();
        };
        
        console.log('UI updated for authenticated user');
    }

    // Open Sign In popup when Sign In button is clicked
    signInBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Sign In button clicked!');
        
        // Check if user is already signed in
        const currentUser = await checkCurrentUser();
        if (currentUser) {
            // Already signed in -> go to app page
            window.location.href = 'app.html';
            return;
        }
        
        openPopup(signInPopup);
    });

    // Open Sign Up popup when Sign Up button is clicked
    signUpBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Sign Up button clicked!');
        
        // Check if user is already signed in
        const currentUser = await checkCurrentUser();
        if (currentUser) {
            // If signed in, sign out
            await supabase.auth.signOut();
            location.reload();
            return;
        }
        
        openPopup(signUpPopup);
    });

    // Close popups when close buttons are clicked
    closeSignInPopup.addEventListener('click', closeAllPopups);
    closeSignUpPopup.addEventListener('click', closeAllPopups);

    // Close popups when clicking outside
    signInPopup.addEventListener('click', (e) => {
        if (e.target === signInPopup) {
            closeAllPopups();
        }
    });

    signUpPopup.addEventListener('click', (e) => {
        if (e.target === signUpPopup) {
            closeAllPopups();
        }
    });

    // Close popups with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && (signInPopup.classList.contains('active') || signUpPopup.classList.contains('active'))) {
            closeAllPopups();
        }
    });

    // Switch between popups
    switchToSignUp.addEventListener('click', (e) => {
        e.preventDefault();
        openPopup(signUpPopup);
    });

    switchToSignIn.addEventListener('click', (e) => {
        e.preventDefault();
        openPopup(signInPopup);
    });

    // Handle Sign In form submission with Supabase
    const signinForm = document.querySelector('.signin-form');
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        
        // Basic validation
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }
        
        // Show loading state
        const submitBtn = signinForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;

        try {
            const result = await signInWithEmail(email, password);
            
            if (result.success) {
                // Redirect to app page on successful sign-in
                window.location.href = 'app.html';
                return;
            } else {
                alert(`Sign in failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Sign in error:', error);
            alert('An unexpected error occurred during sign in.');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Handle Sign Up form submission with Supabase
    const signupForm = document.querySelector('.signup-form');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const terms = document.querySelector('input[name="terms"]').checked;
        
        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all required fields.');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }
        
        if (!terms) {
            alert('Please agree to the Terms of Service and Privacy Policy.');
            return;
        }

        // Show loading state
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;

        try {
            const result = await signUpWithEmail(email, password, name);
            
            if (result.success) {
                alert('Account created successfully! Please check your email to verify your account before signing in.');
                closeAllPopups();
                
                // Optionally, you can auto-open the sign-in popup
                openPopup(signInPopup);
            } else {
                alert(`Sign up failed: ${result.error}`);
            }
        } catch (error) {
            console.error('Sign up error:', error);
            alert('An unexpected error occurred during sign up.');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Handle social sign in buttons with Supabase
    document.querySelectorAll('.social-btn.google').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const result = await signInWithGoogle();
            if (!result.success) {
                alert(`Google sign in failed: ${result.error}`);
            }
        });
    });

    // Handle other social buttons (placeholder for now)
    document.querySelectorAll('.social-btn.facebook, .social-btn.apple').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const provider = btn.classList.contains('facebook') ? 'Facebook' : 'Apple';
            alert(`${provider} sign in will be implemented soon!`);
        });
    });

    // Check for existing session on page load
    checkCurrentUser().then(user => {
        if (user) {
            // Redirect authenticated users directly to app page
            window.location.href = 'app.html';
        }
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);
