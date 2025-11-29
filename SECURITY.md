# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by:

1. **DO NOT** open a public GitHub issue
2. Email the maintainer directly at: althafs2121@gmail.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## Security Best Practices

### For Contributors

- **Never commit credentials** (passwords, API keys, tokens) to the repository
- Use environment variables for all sensitive configuration
- Review `.gitignore` before committing
- Use `git diff` to check for accidental credential exposure
- Enable pre-commit hooks to scan for secrets

### For Maintainers

- Rotate credentials immediately if exposed
- Use GitHub Secret Scanning
- Enable Dependabot security updates
- Review pull requests for security issues
- Keep dependencies up to date

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |
| < 1.0   | :x:                |

## Known Security Measures

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Security headers configured in Next.js
- ✅ Environment variables for sensitive data
- ✅ Supabase authentication with secure cookies
- ⚠️ File upload validation (client-side only - needs improvement)

## Security Checklist for Deployment

- [ ] All environment variables set in production
- [ ] Database password rotated from default
- [ ] RLS policies tested and verified
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Rate limiting enabled
- [ ] Monitoring and logging configured
