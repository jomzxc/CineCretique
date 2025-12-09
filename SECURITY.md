# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.4.x   | :white_check_mark: |
| < 1.4   | :x:                |

## Security Best Practices

### Configuration Security

1. **Never commit credentials**
   - `supabase-config.js` is in `.gitignore` by design
   - Always use `supabase-config.example.js` as template
   - Store real credentials securely

2. **Validate configuration**
   - The application validates Supabase credentials format
   - Invalid credentials will cause fallback to localStorage mode
   - Check browser console for validation messages

### Authentication Security

1. **Admin Account**
   - Default admin credentials (`admin`/`pass123`) are for **development only**
   - In production, implement proper role-based access control
   - Use Supabase Auth with custom claims for admin roles
   - Consider implementing two-factor authentication

2. **User Passwords**
   - Supabase Auth handles password hashing and security
   - Enforce strong password policies via Supabase settings
   - Enable email confirmation for new signups in production
   - Implement password reset functionality

3. **Session Management**
   - Supabase handles session tokens securely
   - Sessions expire automatically
   - Implement proper logout functionality
   - Clear sensitive data on logout

### Database Security

1. **Row Level Security (RLS)**
   - All tables have RLS enabled
   - Users can only access their own data
   - Public read access for movies and reviews
   - Review RLS policies regularly

2. **SQL Injection Prevention**
   - Use Supabase client library (parameterized queries)
   - Never concatenate user input into SQL
   - All database operations use prepared statements

3. **Data Validation**
   - Validate all user input on client side
   - Server-side validation via database constraints
   - Sanitize user-generated content
   - Implement rate limiting for API calls

### Client-Side Security

1. **XSS Prevention**
   - Use `.textContent` instead of `.innerHTML` for user content
   - Sanitize any HTML rendering
   - Implement Content Security Policy headers

2. **CORS Configuration**
   - Configure allowed origins in Supabase settings
   - Restrict to your domain in production
   - Never use wildcard (`*`) in production

3. **API Key Security**
   - The anon key is safe for client-side use
   - Protected by Row Level Security policies
   - Service role key should **never** be used client-side
   - Rotate keys if compromised

## Production Deployment Checklist

- [ ] Replace all placeholder credentials
- [ ] Change admin password or implement RBAC
- [ ] Enable email confirmation for signups
- [ ] Configure CORS for your domain only
- [ ] Review and test all RLS policies
- [ ] Enable Supabase rate limiting
- [ ] Set up monitoring and logging
- [ ] Implement password reset functionality
- [ ] Add Content Security Policy headers
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Implement HTTPS only
- [ ] Add two-factor authentication (optional)
- [ ] Configure backup strategy

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **Do not** open a public issue
2. Contact the maintainers privately
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before disclosure

### What to Include

- Type of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Known Security Considerations

### LocalStorage Mode
- Data stored in browser localStorage
- Not encrypted
- Accessible via browser DevTools
- Suitable for development/demo only
- Not recommended for production

### Supabase Mode
- Data stored in PostgreSQL database
- Encrypted in transit (HTTPS)
- Protected by Row Level Security
- Industry-standard security practices
- Recommended for production

## Security Updates

Security updates will be released as soon as possible when vulnerabilities are discovered. Keep your application updated to the latest version.

## Third-Party Dependencies

This application uses:
- Supabase JS Client - Regularly updated for security
- Bootstrap Icons - CSS only, no security concerns
- No other external dependencies

## Contact

For security concerns, please contact the project maintainers.
