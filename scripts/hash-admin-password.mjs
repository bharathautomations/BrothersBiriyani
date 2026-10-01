// Generates a bcrypt hash for the admin dashboard password.
// Usage: node scripts/hash-admin-password.mjs "YourChosenPassword"
// Paste the printed hash into the ADMIN_PASSWORD_HASH environment variable in Netlify.
// Never commit the plaintext password or this hash to source control.

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-admin-password.mjs "YourChosenPassword"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log(hash);
