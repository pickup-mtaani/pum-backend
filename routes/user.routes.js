
const express = require('express');
var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var User = require('models/user.model')
var Role = require('models/roles.model')
var jwt = require('jsonwebtoken');
const { MakeActivationCode } = require('../helpers/randomNo.helper');
const { SendMessage } = require('../helpers/sms.helper');
var transporter = require('../helpers/transpoter');
var { validateRegisterInput, validateLoginInput, validatePasswordInput } = require('./../va;lidations/user.validations')
// var { authMiddleware, authorized } = require('./../common/authrized');
const router = express.Router();
// const db = require('helpers/db');
// const con = require('db.config');
// var mysql = require('mysql');

router.post('/login', async (req, res) => {
    try {
        let oldDb = req.query.olddb
        const user = await User.findOne({ email: req.body.email });
        const RoleOb = await Role.findOne({ name: "client" })

        if (oldDb && !user) {

            // con.query(`SELECT * FROM user WHERE email =` + mysql.escape(req.body.email), async function (err, result, fields) {
            //     if (err) throw err;
            //     console.log(result[0].name);
            //     const body = req.body
            //     body.password = "password"
            //     body.l_name = result[0].name
            //     body.user_id = result[0].id
            //     body.role = RoleOb._id
            //     body.office = result[0].office
            //     body.hashPassword = bcrypt.hashSync(body.password, 10);
            //     let NewUser = new User(body);
            //     const brancht = await NewUser.save();
            //     const token = await jwt.sign({ email: NewUser.email, email: NewUser.email, _id: NewUser._id }, process.env.JWT_KEY);
            //     return res.status(200).json({ token, email: NewUser.email, email: NewUser.email, _id: NewUser._id });
            // });

            return
        }
        else {

            const user = await User.findOne({ phone_number: req.body.phone_number }).populate('role');
            const mail = await User.findOne({ email: req.body.phone_number }).populate('role');
            if (user && !user.activated) {
                return res.status(401).json({ message: 'Your Account is not Activated kindly enter the code sent to your phon via text message' });
            }
            const { errors, isValid } = validateLoginInput(req.body);
            if (!isValid) {
                let error = Object.values(errors)[0]
                return res.status(400).json(error);
            }

            if (user) {
                const password_match = user.comparePassword(req.body.password, user.hashPassword);
                if (!password_match) {
                    return res.status(401).json({ message: 'Authentication failed with wrong credentials!!' });
                }
                const token = await jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_KEY);
                const userUpdate = await User.findOneAndUpdate({ phone_number: req.body.phone_number }, { verification_code: null }, { new: true, useFindAndModify: false })

                return res.status(200).json({ token, key: process.env.JWT_KEY, email: user.email, _id: user._id, });

            }
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.post('/social-login', async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_KEY);
            return res.status(201).json({ token, key: process.env.JWT_KEY, email: user.email, _id: user._id, role: user.role.name });
        }
        const RoleOb = await Role.findOne({ name: "client" })
        const body = req.body
        body.role = RoleOb._id
        body.verification_code = MakeActivationCode(5)
        body.activated = true
        body.hashPassword = bcrypt.hashSync("password", 10);
        let NewUser = new User(body);
        let savedUser = await NewUser.save();
        const token = await jwt.sign({ email: req.body.email, _id: savedUser._id }, process.env.JWT_KEY);
        return res.status(200).json({ token, key: process.env.JWT_KEY, email: savedUser.email, _id: savedUser._id, role: savedUser.role.name });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.post('/register', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        const phone = await User.findOne({ phone_number: req.body.phone_number });
        if (user || phone) {
            return res.status(400).json({ message: 'User Exists !!' });
        }
        const { errors, isValid } = validateRegisterInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0]
            return res.status(400).json(error);
        }
        const RoleOb = await Role.findOne({ name: "client" })
        const body = req.body
        body.role = RoleOb._id
        body.verification_code = MakeActivationCode(5)
        body.hashPassword = bcrypt.hashSync(body.password, 10);
        let NewUser = new User(body);
        const saved = await NewUser.save();
        const textbody = { address: `+254${body.phone_number}`, Body: `Hi ${body.email}\nYour Activation Code for Pickup mtaani is  ${body.verification_code} ` }
        await SendMessage(textbody)

        return res.status(200).json({ message: 'User Saved Successfully !!', saved });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.post('/:id/resend-token', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const textbody = { address: `+254${user.phone_number}`, Body: `Hi ${user.f_name} ${user.l_name}\nYour Activation Code for Pickup mtaani is  ${user.verification_code} ` }
        // console.log(textbody)
        await SendMessage(textbody)
        return res.status(200).json({ success: false, message: 'Activation resent ' });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.post('/:id/update_password', async (req, res) => {
    try {
        const body = req.body
        const { errors, isValid } = validatePasswordInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0]
            return res.status(400).json(error);;
        }
        const user = await User.findById(req.params.id)
        const password_match = user.comparePassword(req.body.password, user.hashPassword);
        if (!password_match) {
            return res.status(401).json({ message: 'The Previous Password is incorrect!!' });
        }
        let hashPassword = bcrypt.hashSync(body.new_password, 10);
        const Update = await User.findOneAndUpdate({ _id: req.params.id }, { hashPassword }, { new: true, useFindAndModify: false })
        return res.status(400).json({ success: false, message: 'User Updated Successfully ', Update });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.put('/reset-password', async (req, res) => {
    try {
        const body = req.body
        const { errors, isValid } = validatePasswordInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0]
            return res.status(400).json(error);
        }
        let user = {}
        if (req.body.email) {
            user = await User.findOne({ email: req.body.email })
        } else {
            user = await User.findOne({ phone_number: req.body.phone_number })
        }
        let hashPassword = bcrypt.hashSync(body.new_password, 10);
        const Update = await User.findOneAndUpdate({ _id: req.params.id }, { hashPassword }, { new: true, useFindAndModify: false })
        return res.status(400).json({ success: false, message: 'User Updated Successfully ', Update });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});

router.post('/recover_account', async (req, res) => {
    try {
        const body = req.body
        if (req.body.phone_number) {
            const user = await User.findOne({ phone_number: body.phone_number });
            if (!user) {
                return res.status(401).json({ message: 'The phone Number you entered is not registered ' });
            }

            let verification_code = MakeActivationCode(5)
            const userUpdate = await User.findOneAndUpdate({ phone_number: req.body.phone_number }, { verification_code }, { new: true, useFindAndModify: false })

            const textbody = { address: `+254${user.phone_number}`, Body: `Hi ${user.f_name} ${user.l_name}\nYour Activation Code for Pickup mtaani is  ${verification_code} ` }

            await SendMessage(textbody)
            return res.status(200).json({ message: `A recovery Text has been sent to  ${req.body.phone_number}` });
        }
        else if (req.body.email) {
            const user = await User.findOne({ email: req.body.email });
            let verification_code = MakeActivationCode(5)
            if (!user) {
                return res.status(401).json({ message: 'The Email you entered is not registered ' });
            }
            const mailOptions = {
                from: '"Pickup mtaani" <bradcoupers@gmail.com>',
                to: `${req.body.email}`,
                subject: 'Pickup Mtaani Account Recovery',
                template: 'application',

                context: {
                    email: `${req.body.email}`,
                    name: `${req.body.f_name} ${req.body.l_name}`,
                    code: `${verification_code}`,

                }
            };
            const body = req.body
            await transporter.sendMail(mailOptions
                , function async(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        const userUpdate = User.findOneAndUpdate({ email: req.body.email }, { verification_code }, { new: true, useFindAndModify: false })
                        return res.status(200).json({ success: true, message: `Email sent with a recovery code to ${req.body.emai}` });
                        // console.log();
                    }
                });
        }


    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});

router.post('/:id', async (req, res) => {
    try {
        const Exists = await User.findOne({ email: req.body.email });
        return res.status(200).json({ Exists });

    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.put('/update-user', async (req, res) => {
    try {
        let body = req.body
        if (body.password) {
            body.hashPassword = bcrypt.hashSync(body.password, 10);
        }
        body.updatedAt = new Date();
        const userUpdate = await User.findOneAndUpdate({ email: body.email }, body, { new: true, useFindAndModify: false })
        return res.status(200).json({ userUpdate });

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
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.put('/user/re-activate', async (req, res) => {
    try {
        let user = await User.findOne({ phone_number: req.body.phone_number });


        if (parseInt(user.verification_code) !== parseInt(req.body.code)) {
            return res.status(400).json({ message: 'Wrong Code kindly re-enter the code correctly' });
        }
        else {
            await User.findOneAndUpdate({ phone_number: req.body.phone_number }, { activated: true }, { new: true, useFindAndModify: false })
            return res.status(200).json({ message: 'User Activated successfully and can now login !!' });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.post('/user/delete', async (req, res) => {
    try {
        const user = await User.findOne({ f_name: req.body.f_name })
        if (user == null) {
            return res.status(400).json({ success: false, message: 'user not found ' });
        }

        await User.findOneAndDelete({ f_name: req.body.f_name })
        return res.status(200).json({ message: 'User Deleted' });



    } catch (error) {
        console.log(error)
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
router.get('/users', async (req, res) => {

    try {
        const Users = await User.find().populate('role')
        return res.status(200).json({ message: 'Users Fetched Successfully !!', Users });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});


module.exports = router;
