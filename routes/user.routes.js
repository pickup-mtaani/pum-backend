const express = require('express');
var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var User = require('models/user.model')
var Role = require('models/roles.model')
var jwt = require('jsonwebtoken');
const { MakeActivationCode } = require('../helpers/randomNo.helper');
const { SendMessage } = require('../helpers/sms.helper');

// var { authMiddleware, authorized } = require('./../common/authrized');
const router = express.Router();
// const db = require('helpers/db');
const con = require('db.config');
var mysql = require('mysql');

router.post('/login', async (req, res) => {
    try {
        let oldDb = req.query.olddb
        const user = await User.findOne({ username: req.body.username });
        const RoleOb = await Role.findOne({ name: "client" })

        if (oldDb && !user) {

            con.query(`SELECT * FROM user WHERE username =` + mysql.escape(req.body.username), async function (err, result, fields) {
                if (err) throw err;
                console.log(result[0].name);
                const body = req.body
                body.password = "password"
                body.l_name = result[0].name
                body.user_id = result[0].id
                body.role = RoleOb._id
                body.office = result[0].office
                body.hashPassword = bcrypt.hashSync(body.password, 10);
                let NewUser = new User(body);
                const brancht = await NewUser.save();
                const token = await jwt.sign({ username: NewUser.username, username: NewUser.username, _id: NewUser._id }, process.env.JWT_KEY);
                return res.status(200).json({ token, username: NewUser.username, username: NewUser.username, _id: NewUser._id });
            });

            return
        }
        else {

            const user = await User.findOne({ username: req.body.username }).populate('role');
            console.log(user)
            if (user && !user.activated) {
                return res.status(401).json({ message: 'Your Account is not Activated kindly enter the code sent to your phon via text message' });
            }


            if (user) {
                const password_match = user.comparePassword(req.body.password, user.hashPassword);
                if (!password_match) {
                    return res.status(401).json({ message: 'Authentication failed with wrong credentials!!' });
                }
                const token = await jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_KEY);
                return res.status(200).json({ token, key: process.env.JWT_KEY, username: user.username, _id: user._id, role: user.role.name });


                // const token = await jwt.sign({ username: mail.username, username: mail.username, _id: mail._id }, process.env.JWT_KEY);
                // return res.status(200).json({ token, key: process.env.JWT_KEY, username: mail.username, username: mail.username, _id: mail._id });
            }
            // return res.status(400).json({ message: 'User Not found !!' });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});

router.post('/register', async (req, res) => {
    try {

        const user = await User.findOne({ username: req.body.username });
        if (user) {
            return res.status(400).json({ message: 'User Exists !!' });
        }
        const RoleOb = await Role.findOne({ name: "client" })
        const body = req.body
        body.role = RoleOb._id
        body.verification_code = MakeActivationCode(5)
        body.hashPassword = bcrypt.hashSync(body.password, 10);
        let NewUser = new User(body);
        const brancht = await NewUser.save();
        const recObj = { address: `+254${body.phone_number}`, Body: `Hi ${body.username}\nYour Activation Code is ${body.verification_code} ` }
        await SendMessage(recObj)
        console.log(recObj)
        return res.status(400).json({ message: 'User Saved Successfully !!', brancht });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});

router.put('/user/:id/activate', async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.params.id });


        if (parseInt(user.verification_code) !== parseInt(req.body.code)) {

            return res.status(400).json({ message: 'Wrong Code kindly re-enter the code correctly' });

        }
        else {
            await User.findOneAndUpdate({ _id: req.params.id }, { activated: true }, { new: true, useFindAndModify: false })
            return res.status(200).json({ message: 'User Activated successfully and can now login !!' });
        }


    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});

router.get('/user/:id', async (req, res) => {
    try {
        const userObj = await User.findById(req.params.id).populate('role')
        console.log(userObj);
        return res.status(400).json({ message: 'User Fetched Successfully !!', userObj });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});


module.exports = router;