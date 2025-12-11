const bcrypt = require('bcrypt');

async function testPassword() {
    const password = 'Admin@123';
    const hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    
    const isValid = await bcrypt.compare(password, hash);
    console.log('Password valid:', isValid);
    
    // Also test bcrypt hashing to see what we should expect
    const newHash = await bcrypt.hash(password, 10);
    console.log('New hash:', newHash);
    
    const isNewValid = await bcrypt.compare(password, newHash);
    console.log('New hash valid:', isNewValid);
}

testPassword().catch(console.error);