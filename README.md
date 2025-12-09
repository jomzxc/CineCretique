# CineCriteque

A movie review platform with community critiques, ratings, and social features.

## Features

- 🎬 Browse and discover movies by genre
- ⭐ Rate and review movies
- 💬 Comment and discuss with the community
- 📋 Create and manage your watchlist
- 👍 Like and interact with reviews
- 👥 Follow other users and see their activity
- 🏆 Earn badges for your activity
- 🎭 Featured movies and premiere events

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: LocalStorage (fallback mode)

## Quick Start

### Option 1: LocalStorage Mode (No Setup Required)

Simply open `Index.html` in your browser. The application will use localStorage to store data locally.

### Option 2: Supabase Database Mode (Recommended)

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Follow the setup guide in `SUPABASE_SETUP.md`
4. Copy `supabase-config.example.js` to `supabase-config.js`
5. Update `supabase-config.js` with your Supabase credentials
6. Open `Index.html` in your browser

The application will automatically detect and use Supabase if configured.

## Database Features

When connected to Supabase, you get:

- ✅ Persistent data storage across devices
- ✅ Real-time updates
- ✅ Secure authentication with email
- ✅ Row-level security for data protection
- ✅ Scalable PostgreSQL database
- ✅ Social features (follows, likes, comments)

## File Structure

```
CineCriteque/
├── Index.html                      # Main HTML file
├── CSS/
│   └── style.css                   # Application styles
├── JS/
│   ├── game.js                     # Main application logic
│   └── supabase-integration.js     # Supabase integration layer
├── SOURCE/
│   └── Image/                      # Image assets
├── supabase-config.js              # Supabase configuration (not in git)
├── supabase-config.example.js      # Example configuration
├── database-schema.sql             # Database schema for Supabase
└── SUPABASE_SETUP.md              # Detailed setup instructions
```

## Admin Features

Admin account credentials (localStorage mode only):
- Username: `admin`
- Password: `pass123`

Admin can:
- Add new movies
- Edit existing movies
- Delete movies
- Mark movies as featured or premiere
- Manage users

## Development

The application uses vanilla JavaScript with no build step required. Simply edit the files and refresh your browser.

### Backward Compatibility

The application maintains full backward compatibility with localStorage mode. If Supabase is not configured or unavailable, it automatically falls back to localStorage.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is part of BSIT NA-3A coursework.

## Version

Current version: 1.4 with Supabase integration