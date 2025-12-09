# Supabase Setup Guide for CineCriteque

This guide will help you set up Supabase for the CineCriteque application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Basic understanding of SQL and database concepts

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Enter project details:
   - Name: CineCriteque
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (this may take a few minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to Settings > API
2. Copy the following values:
   - Project URL (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - anon public key (starts with `eyJ...`)

## Step 3: Configure the Application

1. Open `supabase-config.js` in your project
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with your Project URL
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon key
   ```

## Step 4: Set Up the Database Schema

1. In your Supabase project dashboard, go to the SQL Editor
2. Open the `database-schema.sql` file from this project
3. Copy the entire contents
4. Paste it into the SQL Editor in Supabase
5. Click "Run" to execute the SQL and create all tables

This will create the following tables:
- `profiles` - User profiles
- `movies` - Movie information
- `reviews` - Movie reviews and ratings
- `watchlist` - User watchlists
- `review_likes` - Likes on reviews
- `follows` - User follows/followers
- `user_badges` - User achievement badges

## Step 5: Configure Authentication

1. In Supabase dashboard, go to Authentication > Providers
2. Enable Email provider (it's enabled by default)
3. (Optional) Configure email templates for confirmation emails
4. (Optional) Disable email confirmation for testing:
   - Go to Authentication > Settings
   - Scroll to "Email Auth"
   - Uncheck "Enable email confirmations"

## Step 6: Set Up Row Level Security (RLS)

The provided SQL schema already includes Row Level Security policies. These ensure:
- Users can only modify their own data
- Everyone can view public content (movies, reviews)
- Users can only access their own watchlists
- Authentication is required for certain operations

## Step 7: Test the Connection

1. Open `Index.html` in a web browser
2. Open the browser console (F12)
3. You should see "Supabase client initialized" in the console
4. Try signing up for a new account
5. If successful, your application is now connected to Supabase!

## Optional: Seed Data

To add initial movies to your database:

1. Go to SQL Editor in Supabase
2. Run the following SQL to add sample movies:

```sql
INSERT INTO movies (title, year, genre, description, poster, trailer_url, is_featured, origin) VALUES
  ('Avengers: Endgame', 2019, 'Action', 'Heroes assemble for the final stand.', 'images/avengers-endgame.jpg', 'https://www.youtube.com/embed/TcMBFSGVi1c', true, 'National'),
  ('Inception', 2010, 'Sci-Fi', 'Dreams within dreams.', 'images/inception.jpg', 'https://www.youtube.com/embed/YoHD9XEInc0', false, 'National');
```

## Troubleshooting

### Connection Issues
- Make sure you've replaced `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with actual values
- Check browser console for error messages
- Verify your Supabase project is active

### Authentication Issues
- Check if email confirmation is required
- Verify RLS policies are set up correctly
- Check Authentication logs in Supabase dashboard

### Database Issues
- Make sure all tables were created successfully
- Check the SQL Editor for any error messages
- Verify RLS policies are enabled

## Admin Account Management

### LocalStorage Mode
The default admin credentials are:
- Username: `admin`
- Password: `pass123`

**⚠️ SECURITY WARNING**: These hardcoded credentials are for development/demo purposes only!

### Supabase Mode (Recommended)
For production use with Supabase:

1. Create an admin user through normal sign-up
2. In Supabase dashboard, go to your `profiles` table
3. Create a custom `role` column: `ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';`
4. Set the admin user's role: `UPDATE profiles SET role = 'admin' WHERE username = 'your_admin_username';`
5. Update RLS policies to check the `role` column for admin actions

**Better approach**: Use Supabase's built-in Auth policies and custom claims for role-based access control.

## Security Notes

- Never commit your Supabase credentials to version control
- The anon key is safe to use in client-side code (it's protected by RLS)
- Change default admin password immediately in production
- For production, implement proper role-based access control through Supabase Auth
- Use environment variables for sensitive configuration
- Consider implementing API rate limiting
- Enable email confirmation for new sign-ups in production

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
