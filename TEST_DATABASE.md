# Test Database Setup

This project uses a separate test database to ensure clean, isolated testing environment.

## Configuration

### Environment Files
- `.env` - Production/development database: `memento`
- `.env.test` - Test database: `memento_test` (tracked in git)

### Test Database Features
- **Automatic Recreation**: Test database is dropped and recreated before each test run
- **Clean State**: Each test run starts with a fresh database
- **Isolated**: Tests don't interfere with development data

## Commands

```bash
# Setup test database manually
bun run db:test-setup

# Run all tests (automatically recreates test database)
bun test

# Run only unit tests
bun test:unit

# Run only integration tests  
bun test:integration
```

## Database Schema

The test database automatically applies all Better Auth migrations:
- `user` - User accounts
- `session` - User sessions
- `account` - Social provider accounts
- `verification` - Email/phone verification

## Technical Details

- Test database connection uses lazy initialization
- Admin operations connect to `postgres` default database
- Test environment variables loaded from `.env.test`
- Database cleanup handled automatically on test completion

## Safety Features

- Validates database name contains `_test` suffix
- Prevents accidental operations on production database
- Separate connection pools for test and admin operations