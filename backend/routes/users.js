const express = require('express');
const bcrypt = require('bcrypt');

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
                    error: err
                })
            })
        })
});

module.exports = router;