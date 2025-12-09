// Supabase Integration for CineCriteque
// This file extends the main application with Supabase database functionality

// Global state
let useSupabase = false;
let currentUserProfile = null;

// Initialize Supabase on page load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    supabase = initSupabase();
    
    // Check if Supabase is configured
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
      useSupabase = true;
      console.log('Supabase integration enabled');
      
      // Check for existing session
      const session = await auth.getSession();
      if (session) {
        await handleAuthStateChanged(session.user);
      }
      
      // Listen for auth state changes
      auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN') {
          await handleAuthStateChanged(session.user);
        } else if (event === 'SIGNED_OUT') {
          handleSignOut();
        }
      });
      
      // Override default functions with Supabase versions
      overrideWithSupabaseFunctions();
    } else {
      console.log('Supabase not configured, using localStorage');
      useSupabase = false;
    }
  } catch (error) {
    console.error('Error initializing Supabase:', error);
    useSupabase = false;
  }
});

async function handleAuthStateChanged(user) {
  if (!user) return;
  
  try {
    // Get user profile
    currentUserProfile = await db.getUserProfile(user.id);
    currentUser = currentUserProfile.username;
    
    // Update UI
    updateButtons();
    await loadSupabaseData();
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
}

function handleSignOut() {
  currentUser = null;
  currentUserProfile = null;
  updateButtons();
  renderMovies();
  renderFeaturedMovies();
  renderPremiereHero();
  renderFriendsFeed();
  renderRecommendations();
}

async function loadSupabaseData() {
  try {
    // Load movies from Supabase
    const movies = await db.getMovies();
    
    // Transform to match localStorage format
    const transformedMovies = movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      genre: movie.genre,
      desc: movie.description,
      poster: movie.poster,
      trailerUrl: movie.trailer_url,
      origin: movie.origin,
      isFeatured: movie.is_featured,
      isPremiere: movie.is_premiere,
      reviews: [] // Reviews will be loaded separately
    }));
    
    // Load reviews for each movie
    for (const movie of transformedMovies) {
      const reviews = await db.getReviews(movie.id);
      movie.reviews = reviews.map(review => ({
        user: review.username,
        stars: review.stars,
        comment: review.comment,
        timestamp: review.created_at,
        likes: review.review_likes.map(like => like.user_id),
        reviewId: review.id
      }));
    }
    
    // Update localStorage for compatibility with existing code
    localStorage.setItem('movies', JSON.stringify(transformedMovies));
    
    // Render UI
    renderPremiereHero();
    renderFeaturedMovies();
    renderMovies();
    renderFriendsFeed();
    renderRecommendations();
  } catch (error) {
    console.error('Error loading Supabase data:', error);
    showAlert('Error', 'Failed to load data from database');
  }
}

// Override functions with Supabase versions
function overrideWithSupabaseFunctions() {
  // Store original functions
  const originalSignInBtn = signInBtn.onclick;
  const originalSignUpBtn = signUpBtn.onclick;
  const originalSaveReview = window.saveReview;
  const originalToggleWatchlist = window.toggleWatchlist;
  const originalToggleLikeReview = window.toggleLikeReview;
  const originalSaveAdminChanges = saveAdminChangesBtn.onclick;
  const originalDeleteMovie = window.deleteMovie;
  const originalDeleteReview = window.deleteReview;
  
  // Override sign in
  signInBtn.onclick = async () => {
    const emailField = document.getElementById('authEmail');
    const email = emailField ? emailField.value.trim() : '';
    const pass = authPass.value.trim();
    
    if (!email || !pass) {
      return showAlert('Error', 'Please fill all fields.');
    }
    
    try {
      const { user } = await auth.signIn(email, pass);
      closeModal(authModal);
      showAlert('Welcome!', `Successfully logged in.`);
    } catch (error) {
      console.error('Sign in error:', error);
      showAlert('Login Failed', error.message || 'Invalid email or password.');
    }
  };
  
  // Override sign up
  signUpBtn.onclick = async () => {
    const emailField = document.getElementById('signUpEmail');
    const email = emailField ? emailField.value.trim() : '';
    const username = signUpUser.value.trim();
    const pass = signUpPass.value.trim();
    const pfpUrl = signUpPfp.value.trim();
    
    if (!email || !username || !pass || !pfpUrl) {
      return showAlert('Error', 'Please fill all fields.');
    }
    
    try {
      await auth.signUp(email, pass, username, pfpUrl);
      showAlert('Success', 'Account created successfully! Please log in.');
      authPanel.classList.remove('right-panel-active');
      if (emailField) emailField.value = '';
      signUpUser.value = '';
      signUpPass.value = '';
      signUpPfp.value = '';
    } catch (error) {
      console.error('Sign up error:', error);
      showAlert('Sign Up Failed', error.message || 'Failed to create account.');
    }
  };
  
  // Override logout
  document.getElementById('dropdownLogoutBtn').onclick = async () => {
    profileDropdownMenu.classList.add('hidden');
    profileDropdownToggle.classList.remove('open');
    
    showConfirm('Log Out?', 'Are you sure you want to log out?', async () => {
      try {
        await auth.signOut();
        showAlert('Success', 'You have been logged out.');
      } catch (error) {
        console.error('Logout error:', error);
      }
    });
  };
  
  // Override save review
  window.saveReview = async function(title, mode = 'normal') {
    if (!useSupabase || !currentUserProfile) {
      return originalSaveReview(title, mode);
    }
    
    const ratingEl = document.querySelector(`input[name="${mode === 'premiere' ? 'ratingPremiere' : 'ratingNormal'}"]:checked`);
    const commentEl = document.getElementById(mode === 'premiere' ? 'reviewCommentPremiere' : 'reviewCommentNormal');
    
    if (!ratingEl) return showAlert('Error', 'Please select a star rating.');
    
    const rating = parseInt(ratingEl.value, 10);
    const comment = commentEl.value.trim();
    
    if (!comment) return showAlert('Error', 'Please write a comment.');
    
    try {
      const movies = JSON.parse(localStorage.getItem('movies'));
      const movie = movies.find(m => m.title === title);
      
      if (!movie) return;
      
      // Add review to Supabase
      const review = {
        movie_id: movie.id,
        user_id: currentUserProfile.id,
        username: currentUserProfile.username,
        stars: rating,
        comment: comment
      };
      
      await db.addReview(review);
      
      // Reload data
      await loadSupabaseData();
      
      // Reset form
      ratingEl.checked = false;
      commentEl.value = '';
      
      // Re-render movie modal
      openMovie(title);
      
      showAlert('Success', 'Review added successfully!');
    } catch (error) {
      console.error('Error saving review:', error);
      showAlert('Error', 'Failed to save review.');
    }
  };
  
  // Override toggle watchlist
  window.toggleWatchlist = async function(title) {
    if (!useSupabase || !currentUserProfile) {
      return originalToggleWatchlist(title);
    }
    
    try {
      const movies = JSON.parse(localStorage.getItem('movies'));
      const movie = movies.find(m => m.title === title);
      
      if (!movie) return;
      
      // Check if in watchlist
      const watchlist = await db.getWatchlist(currentUserProfile.id);
      const inWatchlist = watchlist.some(w => w.movie_id === movie.id);
      
      if (inWatchlist) {
        await db.removeFromWatchlist(currentUserProfile.id, movie.id);
        showAlert('Watchlist', `"${title}" removed from your watchlist.`);
      } else {
        await db.addToWatchlist(currentUserProfile.id, movie.id);
        showAlert('Watchlist', `"${title}" added to your watchlist.`);
      }
      
      // Update button state
      const normalBookmarkBtn = document.getElementById('normalBookmarkBtn');
      const premiereBookmarkBtn = document.getElementById('premiereBookmarkBtn');
      updateBookmarkButton(normalBookmarkBtn, !inWatchlist);
      updateBookmarkButton(premiereBookmarkBtn, !inWatchlist);
      
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      showAlert('Error', 'Failed to update watchlist.');
    }
  };
  
  // Override toggle like review
  window.toggleLikeReview = async function(title, reviewIndex, mode) {
    if (!useSupabase || !currentUserProfile) {
      return originalToggleLikeReview(title, reviewIndex, mode);
    }
    
    try {
      const movies = JSON.parse(localStorage.getItem('movies'));
      const movie = movies.find(m => m.title === title);
      
      if (!movie || !movie.reviews[reviewIndex]) return;
      
      const review = movie.reviews[reviewIndex];
      
      if (!review.reviewId) {
        console.error('Review ID not found');
        return;
      }
      
      await db.toggleReviewLike(currentUserProfile.id, review.reviewId);
      
      // Reload data and re-render
      await loadSupabaseData();
      openMovie(title);
      
    } catch (error) {
      console.error('Error toggling like:', error);
      showAlert('Error', 'Failed to update like.');
    }
  };
  
  // Override save admin changes (add/edit movie)
  saveAdminChangesBtn.onclick = async () => {
    if (!useSupabase) {
      return originalSaveAdminChanges();
    }
    
    const title = movieTitle.value.trim();
    const year = movieYear.value.trim();
    const genre = movieGenre.value;
    const desc = movieDesc.value.trim();
    const poster = moviePoster.value.trim();
    const trailerUrl = convertYouTubeUrl(movieTrailerUrl.value.trim());
    const isFeatured = movieIsFeatured.checked;
    const origin = movieOrigin.value;
    const isPremiere = movieIsPremiere.checked;
    
    if (!title || !year || !desc || !poster) {
      return showAlert('Error', 'Please fill all fields!');
    }
    
    if (isPremiere && !trailerUrl) {
      return showAlert('Error', 'A Premiere movie must have a YouTube Trailer URL.');
    }
    
    try {
      const movieData = {
        title,
        year: parseInt(year),
        genre,
        description: desc,
        poster,
        trailer_url: trailerUrl,
        is_featured: isFeatured,
        origin,
        is_premiere: isPremiere
      };
      
      if (editTarget === null) {
        // Add new movie
        await db.addMovie(movieData);
        showAlert('Success', 'Movie added successfully!');
      } else {
        // Update existing movie
        const movies = JSON.parse(localStorage.getItem('movies'));
        const movie = movies.find(m => m.title === editTarget);
        
        if (movie && movie.id) {
          await db.updateMovie(movie.id, movieData);
          showAlert('Success', 'Movie updated successfully!');
        }
      }
      
      closeModal(adminPanel);
      editTarget = null;
      
      // Reload data
      await loadSupabaseData();
      
    } catch (error) {
      console.error('Error saving movie:', error);
      showAlert('Error', 'Failed to save movie.');
    }
  };
  
  // Override delete movie
  window.deleteMovie = async function(title) {
    if (!useSupabase) {
      return originalDeleteMovie(title);
    }
    
    showConfirm('Delete Movie?', `Are you sure you want to delete "${title}"? This cannot be undone.`, async () => {
      try {
        const movies = JSON.parse(localStorage.getItem('movies'));
        const movie = movies.find(m => m.title === title);
        
        if (movie && movie.id) {
          await db.deleteMovie(movie.id);
          await loadSupabaseData();
          showAlert('Success', 'Movie deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting movie:', error);
        showAlert('Error', 'Failed to delete movie.');
      }
    });
  };
  
  // Override delete review
  window.deleteReview = async function(title, index, mode = 'normal') {
    if (!useSupabase) {
      return originalDeleteReview(title, index, mode);
    }
    
    showConfirm('Delete Review?', 'Are you sure you want to delete this review? This cannot be undone.', async () => {
      try {
        const movies = JSON.parse(localStorage.getItem('movies'));
        const movie = movies.find(m => m.title === title);
        
        if (movie && movie.reviews[index] && movie.reviews[index].reviewId) {
          await db.deleteReview(movie.reviews[index].reviewId);
          await loadSupabaseData();
          openMovie(title);
          showAlert('Success', 'Review deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        showAlert('Error', 'Failed to delete review.');
      }
    });
  };
}
