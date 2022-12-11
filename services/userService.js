const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const SECRET = 'dsaghjk1slv45230'
const tokenBlacklist = new Set();


async function register(username, email, password) {
    const existingUsername = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });
    const existingEmail = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });

    if(existingUsername) {
        throw new Error('Username is taken!');
    }
    if(existingEmail) {
        throw new Error('Email is taken!');
    }

    const user = await User.create({
        username,
        email,
        hashedPassword: await bcrypt.hash(password, 10),
    })

    return createToken(user);
}

async function login(email, password) {
    const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
    if(!user) {
        throw new Error('Incorrect email or password!');
    }

    const match = await bcrypt.compare(password, user.hashedPassword);
    if(!match) {
        throw new Error('Incorrect email or password!');
    }

    return createToken(user);
}

async function logout(token) {
    tokenBlacklist.add(token);

}

async function createToken(user) {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
    }

    return {
        _id: user._id,
        email: user.email,
        accessToken: jwt.sign(payload, SECRET),
    }
};

function parseToken(token) {
    if(tokenBlacklist.has(token)){
        throw new Error('Token is blacklisted')
    }

    return jwt.verify(token, SECRET);

}




module.exports = {
    register,
    login,
    logout,
    parseToken
}