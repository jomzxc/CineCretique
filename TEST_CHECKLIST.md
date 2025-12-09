# CineCriteque - Testing Checklist

This checklist helps verify that all features are working correctly.

## Prerequisites

### For LocalStorage Mode (Quick Test)
- [x] Open `Index.html` in a modern browser
- [x] Open browser console (F12) to see logs

### For Supabase Mode (Full Test)
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Database schema executed (from `database-schema.sql`)
- [ ] `supabase-config.js` configured with credentials
- [ ] Open `Index.html` in browser
- [ ] Check console for "✅ Supabase integration enabled" message

## Authentication Tests

### Sign Up
- [ ] Click "Log In" button
- [ ] Click "Sign Up" button (desktop) or toggle link (mobile)
- [ ] Fill in all fields:
  - Email: test@example.com
  - Username: testuser
  - Password: Test123!
  - Profile Picture URL: https://i.pravatar.cc/150?img=1
- [ ] Click "Sign Up"
- [ ] Verify success message appears
- [ ] Verify form switches to login

### Sign In
- [ ] Enter email and password
- [ ] Click "Log In"
- [ ] Verify success message
- [ ] Verify profile dropdown appears in header
- [ ] Verify username shows in dropdown

### Admin Login (LocalStorage mode only)
- [ ] Click "Log In"
- [ ] Enter username: admin
- [ ] Enter password: pass123
- [ ] Verify login successful
- [ ] Verify "Add Movie" and "Manage Users" buttons appear

## Movie Features

### Browse Movies
- [ ] Verify movies are displayed in grid
- [ ] Verify featured movies section (if any)
- [ ] Verify premiere hero section (if any)
- [ ] Try different genre filters
- [ ] Try different sort options
- [ ] Try search functionality
- [ ] Verify pagination works

### View Movie Details
- [ ] Click on any movie card
- [ ] Verify modal opens
- [ ] Verify movie details display
- [ ] Verify trailer plays (if available)
- [ ] Verify reviews section shows
- [ ] Verify average rating displays

### Add Movie (Admin Only)
- [ ] Login as admin
- [ ] Click "Add Movie" button
- [ ] Fill in all fields:
  - Title: Test Movie
  - Year: 2024
  - Genre: Action
  - Origin: National
  - Description: This is a test movie
  - Poster URL: https://via.placeholder.com/300x450
  - Trailer URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
- [ ] Check "Featured" checkbox (optional)
- [ ] Click "Add Movie"
- [ ] Verify success message
- [ ] Verify movie appears in grid

### Edit Movie (Admin Only)
- [ ] Login as admin
- [ ] Click edit button (pencil icon) on any movie
- [ ] Modify title or description
- [ ] Click "Save Changes"
- [ ] Verify success message
- [ ] Verify changes reflected

### Delete Movie (Admin Only)
- [ ] Login as admin
- [ ] Click delete button (X icon) on any movie
- [ ] Confirm deletion
- [ ] Verify movie removed from grid

## Review/Rating Features

### Add Review
- [ ] Login (not as admin)
- [ ] Click on any movie
- [ ] Select star rating (1-5 stars)
- [ ] Write a comment
- [ ] Click "Submit"
- [ ] Verify review appears in list
- [ ] Verify average rating updates

### Edit Review
- [ ] Find your own review
- [ ] Click edit button (pencil icon)
- [ ] Modify rating or comment
- [ ] Click "Update Review"
- [ ] Verify changes saved

### Delete Review
- [ ] Find your own review
- [ ] Click delete button (X icon)
- [ ] Confirm deletion
- [ ] Verify review removed

### Like/Unlike Review
- [ ] Login (not as admin)
- [ ] Click on any movie
- [ ] Find any review (not your own)
- [ ] Click thumbs up icon
- [ ] Verify like count increases
- [ ] Click again to unlike
- [ ] Verify like count decreases

## Watchlist Features

### Add to Watchlist
- [ ] Login (not as admin)
- [ ] Click on any movie
- [ ] Click bookmark icon
- [ ] Verify "Added to watchlist" message
- [ ] Go to "My Profile"
- [ ] Verify movie appears in "My Watchlist"

### Remove from Watchlist
- [ ] Click on movie in watchlist or modal
- [ ] Click bookmark icon again
- [ ] Verify "Removed from watchlist" message
- [ ] Verify movie removed from watchlist

## Profile Features

### View Own Profile
- [ ] Login
- [ ] Click profile dropdown
- [ ] Click "My Profile"
- [ ] Verify profile displays:
  - Profile picture
  - Username
  - Badges (if any)
  - Watchlist
  - Reviews

### Edit Profile
- [ ] On profile page, click "Edit Profile"
- [ ] Change profile picture URL
- [ ] Optionally change password
- [ ] Click "Save Changes"
- [ ] Verify changes saved

### View Other User Profile
- [ ] Click on username in any review
- [ ] Verify profile opens
- [ ] Verify follow button shows (if not own profile)
- [ ] Verify can't edit other profiles

## Social Features

### Follow User
- [ ] Login
- [ ] View another user's profile
- [ ] Click "Follow" button
- [ ] Verify button changes to "Following"

### Unfollow User
- [ ] Click "Following" button
- [ ] Verify button changes to "Follow"

### Friends Feed
- [ ] Follow at least one user
- [ ] Have that user post a review
- [ ] Click "Friends Feed" tab
- [ ] Verify friend's activity shows
- [ ] Click on movie or username in feed
- [ ] Verify navigation works

## Badge System

### Earn Badges
- [ ] Write your first review → Get "First Review" badge
- [ ] Write 10 Action movie reviews → Get "Action Fan" badge
- [ ] Write 25 total reviews → Get "Review Pro" badge
- [ ] Review all genres → Get "Genre Explorer" badge
- [ ] Verify badges show on profile
- [ ] Verify badge modal displays on earning

## UI/UX Tests

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify navigation works on all sizes
- [ ] Verify modals are usable on all sizes

### Modal Functionality
- [ ] Movie modal opens and closes
- [ ] Auth modal opens and closes
- [ ] Admin panel opens and closes
- [ ] Edit profile modal opens and closes
- [ ] Verify modals close with X button
- [ ] Verify modals have proper animations

### Premiere Movie
- [ ] Admin: Create movie with "Set as Premiere" checked
- [ ] Verify hero section changes to premiere layout
- [ ] Click "Watch Trailer" button
- [ ] Verify premiere modal layout
- [ ] Verify chat-style review section
- [ ] Verify can post reviews

### Navigation
- [ ] Click "Home" → Verify goes to home
- [ ] Click "About" → Verify shows about page
- [ ] Click "My Profile" → Verify shows profile
- [ ] Click "Manage Users" (admin) → Verify shows user list
- [ ] Click logo → Verify returns to home

## Error Handling

### Invalid Inputs
- [ ] Try to submit review without rating
- [ ] Try to submit review without comment
- [ ] Try to add movie without required fields
- [ ] Verify appropriate error messages

### Network Errors (Supabase mode)
- [ ] Disconnect internet
- [ ] Try any database operation
- [ ] Verify error message shows
- [ ] Reconnect internet
- [ ] Verify operations work again

## Performance Tests

### Load Time
- [ ] Clear cache
- [ ] Load page
- [ ] Verify loads in < 3 seconds
- [ ] Verify no console errors

### Large Dataset
- [ ] Add 50+ movies (use migration or manual)
- [ ] Verify pagination works
- [ ] Verify filtering works
- [ ] Verify search works
- [ ] Verify no lag in UI

## Console Checks

### LocalStorage Mode
- [ ] Verify console shows: "⚠️ Supabase not configured"
- [ ] Verify console shows: "Using localStorage mode"
- [ ] Verify no errors in console

### Supabase Mode
- [ ] Verify console shows: "✅ Supabase integration enabled"
- [ ] Verify console shows: "Supabase client initialized"
- [ ] Verify no errors in console
- [ ] Check Network tab for API calls

## Migration Test (If applicable)

### Migrate from LocalStorage
- [ ] Start with localStorage data
- [ ] Configure Supabase
- [ ] Open console
- [ ] Run `migrateToSupabase()`
- [ ] Verify migration completes
- [ ] Verify all movies migrated
- [ ] Verify reviews migrated

## Security Tests

### Authentication
- [ ] Verify can't access admin features without login
- [ ] Verify can't edit other users' reviews
- [ ] Verify can't view other users' watchlists
- [ ] Verify logout clears session

### XSS Protection
- [ ] Try entering `<script>alert('XSS')</script>` in review
- [ ] Verify script doesn't execute
- [ ] Verify displays as text

### SQL Injection (Supabase mode)
- [ ] Try entering `'; DROP TABLE movies; --` in inputs
- [ ] Verify no database damage
- [ ] Verify proper error handling

## Supabase-Specific Tests

### Database Persistence
- [ ] Add review
- [ ] Close browser
- [ ] Reopen page
- [ ] Login
- [ ] Verify review still exists

### Row Level Security
- [ ] Login as User A
- [ ] Add movie to watchlist
- [ ] Logout
- [ ] Login as User B
- [ ] Verify can't see User A's watchlist
- [ ] Verify can see User A's reviews (public)

### Real-time Features (if enabled)
- [ ] Open app in two browsers
- [ ] Login as different users
- [ ] Add review in Browser A
- [ ] Verify appears in Browser B (may need refresh)

## Final Checks

- [ ] All required features working
- [ ] No console errors
- [ ] No broken links
- [ ] All buttons functional
- [ ] All forms validating
- [ ] All modals working
- [ ] All navigation working
- [ ] Profile pictures loading
- [ ] Movie posters loading
- [ ] Trailers playing
- [ ] Responsive on all devices

## Test Results

Date: _______________
Tester: _______________
Mode: [ ] LocalStorage [ ] Supabase
Overall Status: [ ] Pass [ ] Fail

### Issues Found:
1. _________________
2. _________________
3. _________________

### Notes:
_______________________________________
_______________________________________
_______________________________________
