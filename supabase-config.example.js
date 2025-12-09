// Supabase Configuration Example
// ⚠️ SETUP INSTRUCTIONS:
// 1. Copy this file to: supabase-config.js
// 2. Replace YOUR_SUPABASE_URL with your actual Supabase project URL
// 3. Replace YOUR_SUPABASE_ANON_KEY with your actual anon key
// 4. Get credentials from: Supabase Dashboard > Settings > API
//
// ⚠️ SECURITY: Never commit supabase-config.js to version control!
// The .gitignore file excludes it automatically.

const SUPABASE_URL = 'YOUR_SUPABASE_URL';  // e.g., 'https://xxxxxxxxxxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';  // Your anon/public key from Supabase (starts with 'eyJ')

// Initialize Supabase client
let supabase;

function initSupabase() {
  if (typeof supabase === 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized');
  }
  return supabase;
}

// Database helper functions
const db = {
  // Movies
  async getMovies() {
    const { data, error } = await supabase
      .from('movies')
      .select('*, reviews(*)');
    if (error) throw error;
    return data || [];
  },

  async addMovie(movie) {
    const { data, error } = await supabase
      .from('movies')
      .insert([movie])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateMovie(id, updates) {
    const { data, error } = await supabase
      .from('movies')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteMovie(id) {
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Reviews
  async getReviews(movieId) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, review_likes(*)')
      .eq('movie_id', movieId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addReview(review) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateReview(id, updates) {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async deleteReview(id) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Watchlist
  async getWatchlist(userId) {
    const { data, error } = await supabase
      .from('watchlist')
      .select('movie_id, movies(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  },

  async addToWatchlist(userId, movieId) {
    const { data, error } = await supabase
      .from('watchlist')
      .insert([{ user_id: userId, movie_id: movieId }])
      .select();
    if (error) throw error;
    return data[0];
  },

  async removeFromWatchlist(userId, movieId) {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('movie_id', movieId);
    if (error) throw error;
  },

  // Review Likes
  async toggleReviewLike(userId, reviewId) {
    // Check if like exists
    const { data: existing } = await supabase
      .from('review_likes')
      .select('*')
      .eq('user_id', userId)
      .eq('review_id', reviewId)
      .single();

    if (existing) {
      // Unlike
      const { error } = await supabase
        .from('review_likes')
        .delete()
        .eq('user_id', userId)
        .eq('review_id', reviewId);
      if (error) throw error;
      return false;
    } else {
      // Like
      const { error } = await supabase
        .from('review_likes')
        .insert([{ user_id: userId, review_id: reviewId }]);
      if (error) throw error;
      return true;
    }
  },

  async getReviewLikes(reviewId) {
    const { data, error } = await supabase
      .from('review_likes')
      .select('user_id')
      .eq('review_id', reviewId);
    if (error) throw error;
    return data || [];
  },

  // User Profiles
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();
    if (error) throw error;
    return data[0];
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  // Following
  async followUser(followerId, followingId) {
    const { data, error } = await supabase
      .from('follows')
      .insert([{ follower_id: followerId, following_id: followingId }])
      .select();
    if (error) throw error;
    return data[0];
  },

  async unfollowUser(followerId, followingId) {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);
    if (error) throw error;
  },

  async getFollowing(userId) {
    const { data, error } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId);
    if (error) throw error;
    return data || [];
  }
};

// Authentication helper functions
const auth = {
  async signUp(email, password, username, pfpUrl) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
          pfp: pfpUrl
        }
      }
    });
    if (error) throw error;
    
    // Create profile
    if (data.user) {
      await db.updateUserProfile(data.user.id, {
        username: username,
        pfp: pfpUrl
      });
    }
    
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
