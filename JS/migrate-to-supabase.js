// Migration script to help move data from localStorage to Supabase
// This is a one-time migration utility for existing users

async function migrateLocalStorageToSupabase() {
  if (!useSupabase) {
    console.error('Supabase is not configured. Please set up Supabase first.');
    return;
  }
  
  if (!confirm('This will migrate all your localStorage data to Supabase. Continue?')) {
    return;
  }
  
  try {
    console.log('Starting migration...');
    
    // Get data from localStorage
    const localMovies = JSON.parse(localStorage.getItem('movies') || '[]');
    const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Migrate movies
    console.log(`Migrating ${localMovies.length} movies...`);
    for (const movie of localMovies) {
      try {
        const movieData = {
          title: movie.title,
          year: movie.year,
          genre: movie.genre,
          description: movie.desc,
          poster: movie.poster,
          trailer_url: movie.trailerUrl,
          is_featured: movie.isFeatured || false,
          origin: movie.origin || 'National',
          is_premiere: movie.isPremiere || false
        };
        
        // Check if movie already exists
        const { data: existing } = await supabase
          .from('movies')
          .select('id')
          .eq('title', movie.title)
          .single();
        
        if (!existing) {
          const { data: newMovie } = await db.addMovie(movieData);
          console.log(`✓ Migrated movie: ${movie.title}`);
          
          // Migrate reviews for this movie
          if (movie.reviews && movie.reviews.length > 0) {
            for (const review of movie.reviews) {
              // Skip anonymous reviews
              if (review.user === 'Anonymous') continue;
              
              // Find user in Supabase
              const { data: profiles } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', review.user)
                .single();
              
              if (profiles) {
                const reviewData = {
                  movie_id: newMovie.id,
                  user_id: profiles.id,
                  username: review.user,
                  stars: review.stars,
                  comment: review.comment
                };
                
                await db.addReview(reviewData);
                console.log(`  ✓ Migrated review by ${review.user}`);
              }
            }
          }
        } else {
          console.log(`⊘ Movie already exists: ${movie.title}`);
        }
      } catch (error) {
        console.error(`✗ Failed to migrate movie: ${movie.title}`, error);
      }
    }
    
    console.log('Migration completed!');
    console.log('Note: Users must sign up again with email addresses.');
    showAlert('Migration Complete', 'Your movies have been migrated to Supabase. Users will need to create new accounts with email addresses.');
    
  } catch (error) {
    console.error('Migration failed:', error);
    showAlert('Migration Failed', 'An error occurred during migration. Check console for details.');
  }
}

// Make function available in console for manual migration
window.migrateToSupabase = migrateLocalStorageToSupabase;

// Log instructions on page load
if (useSupabase) {
  console.log('📦 Migration tool available!');
  console.log('To migrate your localStorage data to Supabase, run: migrateToSupabase()');
}
