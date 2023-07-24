const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, resp, next)=>{
    bcrypt.hash(req.body.password, 10)
        .then((hash)=>{
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save().then((result)=>{
                resp.status(201).json({
                    message: "User created",
                    result: result
                })
            }).catch((err)=>{
                resp.status(500).json({
                    message: "Invalid aunthentication credentials!"
                })
            })
        })
});

router.post("/login", (req, resp, next)=>{
    let fetchedUser;
    User.findOne({email: req.body.email})
        .then((user)=>{
            if(!user){
                return resp.status(401).json({
                    message: "Auth failed!"
                })
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password)
        }).then((result)=>{
            if(!result){
                return resp.status(401).json({
                    message: "Auth failed!"
                })
            }
            const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, "secrete_this_string_should_be_longer", {expiresIn: "1h"});
            resp.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            })
        }).catch((err)=>{
            return resp.status(401).json({
                message: "Auth failed!"
            })
        })
})

module.exports = router;