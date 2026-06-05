# Public Safety Review

This repo is safe to publish as a frontend portfolio artifact because production secrets and private operational data are not tracked here.

## Included

- React frontend code
- Static sample report data
- Public legal pages
- Public endpoint URLs
- Test suite
- UI and product documentation

## Excluded

- API keys
- Scraper tokens
- Payment secrets
- Backend prompts
- Real audit logs
- Private host or guest data
- Internal Google Sheets logging code
- Production environment files

## Notes

- `.env.prod` exists locally but is ignored and not tracked.
- `dist/` exists locally but is ignored and not tracked.
- The backend service is separate and remains private.
- `VITE_AUDIT_TOKEN` is a build-time header hook. It is not a real authentication boundary because frontend values are bundled into JavaScript.

