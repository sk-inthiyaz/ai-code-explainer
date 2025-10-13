const bcrypt = require('bcryptjs');
const User = require('../models/User');

const initializeAdmin = async () => {
    try {
        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@codinghub.com' });
        
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('0000', salt);
            
            const admin = new User({
                email: 'admin@codinghub.com',
                password: hashedPassword,
                name: 'Admin',
                isAdmin: true
            });
            
            await admin.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error initializing admin:', error);
    }
};

module.exports = initializeAdmin;