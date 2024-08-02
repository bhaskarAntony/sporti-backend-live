const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/admin');

mongoose.connect('mongodb+srv://bhaskarAntoty123:bhaskar3958@bhaskarantony.wagpkay.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const seedUsers = async () => {
    const users = [
        { username: 'sporti1admin', password: 'password1', role: 'sporti1' },
        { username: 'sporti2admin', password: 'password2', role: 'sporti2' },
        { username: 'superadmin', password: 'superpassword', role: 'superadmin' }
    ];

    for (const user of users) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await User.create(user);
    }

    mongoose.connection.close();
};

seedUsers();
