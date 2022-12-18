const { register, login, logout, getProfileInfo } = require('../services/userService');
const { getByUserId } = require("../services/productService");
const { body, validationResult } = require('express-validator');
const parseError = require('../util/parser');

const authController = require('express').Router();

authController.post('/register',
    body('email').isEmail().withMessage('Invalid email'), 
    body('password').isLength({min: 5}).withMessage('Password should be at least 5 charackters long'), 
    body('username').isLength({ min: 3 }).withMessage('Username shoud be at least 3 charakters long'),
    async(req, res) => {
        console.log(req.body.username, " ", req.body.email, " ", req.body.password)
        try {
            const { errors } = validationResult(req);
            if(errors.length > 0) {
                throw errors;
            }
            const token = await register(req.body.username, req.body.email, req.body.password);
            res.json(token);
        } catch (err) {
            const message = parseError(err);
            res.status(400).json({ message })
        }
    })  

authController.post('/login', async(req, res) => {
    try {
        const token = await login(req.body.email, req.body.password);
        res.json(token);
        // console.log('login token >', token);
    } catch (err) {
        const message = parseError(err);
        res.status(401).json({ message })
    }
}) 

authController.get('/profile/:id', async(req, res) => {
    // console.log('-----------------------',req.user, '-----------------------');

    try {
        const user = await getProfileInfo(req.user._id);
        // const user = await getProfileInfo(tokenId._id)
        res.json(user)
    } catch (err) {
        const message = parseError(err);
        res.status(401).json({ message })
        // alert(json({ message }));
    }
})

authController.get('/profileList/:id', async(req, res) => {
    // console.log('-----------------------',req.user, '-----------------------');

    try {
        const listing = await getByUserId(req.user._id);
        // const user = await getProfileInfo(tokenId._id)
        res.json(listing)
    } catch (err) {
        const message = parseError(err);
        res.status(401).json({ message })
        // alert(json({ message }));
    }
})


authController.get('/logout', async(req, res) => {
    const token = req.token;

    // console.log('-->-- ',req);
    // console.log('--<|>-- ',JSON.parse(sessionStorage.getItem('userData')));
    await logout(token);
    res.status(204).end();
})

module.exports = authController;