const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = 'Admin@2024';

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  console.log('\n🔄 NEW HASH GENERATED:');
  console.log('ADMIN_PASSWORD_HASH=' + hash);
  console.log('\n📋 Copy the line above to your .env file');
});
