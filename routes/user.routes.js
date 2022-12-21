
const express = require('express');
var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var User = require('models/user.model')
var Role = require('models/roles.model')
var moment = require('moment');
var jwt = require('jsonwebtoken');

var Rider = require('models/rider.model')
var Agent = require('models/agentAddmin.model')
const { MakeActivationCode } = require('../helpers/randomNo.helper');
const { SendMessage } = require('../helpers/sms.helper');
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
var transporter = require('../helpers/transpoter');
var AgentUser = require('models/agent_user.model');

var { validateRegisterInput, validateLoginInput, validatePasswordInput } = require('./../va;lidations/user.validations');
const Format_phone_number = require('../helpers/phone_number_formater');
const { request } = require('express');
var AgentLocation = require('models/agents.model')
// var { authMiddleware, authorized } = require('./../common/authrized');
const router = express.Router();
// const db = require('helpers/db');
// const con = require('db.config');
// var mysql = require('mysql');

router.post('/login', async (req, res) => {

    try {
        let oldDb = req.query.olddb
        req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number
        let user = {}
        let userOBJ = await User.findOne({ phone_number: req.body.phone_number })

        if (oldDb && !userOBJ) {

            // con.query(`SELECT * FROM user WHERE email =` + mysql.escape(req.body.email), async function (err, result, fields) {
            //     if (err) throw err;
            //     console.log(result[0].name);
            //     const body = req.body
            //     body.password = "password"
            //     body.l_name = result[0].name
            //     body.user_id = result[0].id
            //    
            //     body.office = result[0].office
            //     body.hashPassword = bcrypt.hashSync(body.passuword, 10);
            //     let NewUser = new User(body);
            //     const brancht = await NewUser.save();
            //     const token = await jwt.sign({ email: NewUser.email, email: NewUser.email, _id: NewUser._id }, process.env.JWT_KEY);
            //     return res.status(200).json({ token, email: NewUser.email, email: NewUser.email, _id: NewUser._id });
            // });
            return
        }

        if (userOBJ && userOBJ.activated === false) {
            if (userOBJ.role === "agent") {
                return res.status(406).json({ message: 'Your Account is not Activated kindly contact support for activation', userOBJ });
            }
            return res.status(406).json({ message: 'Your Account is not Activated kindly enter the code sent to your phone via text message', userOBJ });
        }

        if (!userOBJ) {
            return res.status(402).json({ message: 'Authentication failed with wrong credentials!!' });
        }
        const { errors, isValid } = validateLoginInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0]
            return res.status(400).json({ message: error });
        }

        if (userOBJ && userOBJ.activated) {

            const password_match = await userOBJ.comparePassword(req.body.password, userOBJ.hashPassword);
            if (!password_match) {
                return res.status(402).json({ message: 'Authentication failed with wrong credentials!!', });
            }
            const token = await jwt.sign({ email: userOBJ.email, _id: userOBJ._id }, process.env.JWT_KEY);
            const userUpdate = await User.findOneAndUpdate({ phone_number: req.body.phone_number }, { verification_code: null }, { new: true, useFindAndModify: false })
            // AgentLocation
            if (userOBJ.role === "rider") {
                user = await User.findOne({ _id: userOBJ._id }).populate('rider')
                return res.status(200).json({ token, user });
            }
            if (userOBJ.role === "agent") {
                let agent
                console.log("first", userOBJ._id)
                let userAgent = await AgentUser.findOne({ user: userOBJ._id })
                // let useAgent = await AgentUser.find({ user: userOBJ._id })
                // for (let i = 0; i < useAgent.length; i++) {
                //     console.log("**********************")
                //     console.log("user", userOBJ._id)
                //     console.log("user", useAgent[i].user)
                // }
                // console.log("Afe", useAgent)
                let agent1 = await Agent.findOne({ user: userOBJ._id })

                let rider = agent1?.rider

                let agent_id = userAgent?.agent || agent1?._id
                if (userAgent) {

                    agent = await Agent.findOne({ userAgent: agent })
                    // agent_id = 
                    agent_id = userAgent?.agent

                } else {

                    agent_id = agent?.agent || agent1?._id
                    agent = await Agent.findOne({ user: userOBJ._id })
                }

                // console.log(agent1)
                if (!agent) {
                    user = userOBJ
                } else {

                    // let location = await AgentLocation.findById(agent.location_id)
                    user.token = token
                    // user.agent = agent1._id
                    user.business_name = agent.business_name
                    user.working_days = agent.working_days
                    user.loc = agent.loc
                    // user.location_name = location.name
                    user.opening_hours = agent.opening_hours
                    user.location_id = agent.location_id
                    user.closing_hours = agent.closing_hours
                    user.mpesa_number = agent.mpesa_number
                    user.isSuperAgent = agent1?.isSuperAgent
                    user.phone_number = agent.phone_number
                    user.working_hours = agent.working_hours
                    user.working_days = agent.working_days
                    user.rider = rider
                    user.isSubAgent = userOBJ.isSubAgent
                    user.location = agent.loc
                    user.hasShelf = agent.hasShelf
                    user.images = agent.images
                    user.name = userOBJ.name
                    user.phone_number = userOBJ.phone_number
                    user.agent = agent_id
                    user.email = userOBJ.email
                    user.role = userOBJ.role
                }

            }
            else (
                user = userOBJ
            )


            return res.status(200).json({ token, user });
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
            return res.status(201).json({ token, key: process.env.JWT_KEY, email: user.email, _id: user._id });
        } else {
            const body = req.body
            body.verification_code = MakeActivationCode(5)
            body.activated = true
            body.hashPassword = bcrypt.hashSync("password", 10);
            let NewUser = new User(body);
            let savedUser = await NewUser.save();
            const token = await jwt.sign({ email: req.body.email, _id: savedUser._id }, process.env.JWT_KEY);
            return res.status(200).json({ token, key: process.env.JWT_KEY, email: savedUser.email, _id: savedUser._id });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.post('/register', async (req, res) => {
    try {
        const body = req.body
        req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number
        const user = await User.findOne({ email: req.body.email });
        const phone = await User.findOne({ phone_number: req.body.phone_number });
        if (user || phone) {
            return res.status(402).json({ message: 'User Exists !!', user });
        }
        const { errors, isValid } = validateRegisterInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0]
            return res.status(400).json({ message: error });
        }
        body.verification_code = MakeActivationCode(5)
        body.hashPassword = bcrypt.hashSync(body.password, 10);
        let NewUser = new User(body);
        let saved = await NewUser.save();
        if (req.body.role === "rider") {
            await new Rider({ user: saved._id }).save()
        }
        if (req.body.role === "agent") {
            req.body.activated = false;
            let agent1 = await new Agent({ user: saved._id }).save()
            await new AgentUser({ user: saved._id, agent: agent1._id }).save()
            return res.status(200).json({ message: 'User Saved Successfully !!', saved, agent: agent1._id });
        }
        const textbody = { address: `${body.phone_number}`, Body: `Hi ${body.email}\nYour Activation Code for Pickup mtaani is  ${body.verification_code} ` }
        if (req.body.role === "rider" || req.body.role === "seller") {
            await SendMessage(textbody)
        }
        const mailOptions = {
            from: '"Pickup mtaani" <bradcoupers@gmail.com>',
            to: `${req.body.email}`,
            subject: 'Pickup Mtaani Account Activation',
            template: 'application',
            context: {
                email: `${req.body.email}`,
                name: `${body.f_name} ${body.l_name}`,
                code: `${body.verification_code}`,
            }
        };

        await transporter.sendMail(mailOptions)
        return res.status(200).json({ message: 'User Saved Successfully !!', saved });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.post('/:id/resend-token', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log("User", user)

        if (user.verification_code) {
            const textbody = { address: `${user.phone_number}`, Body: `Hi ${user.f_name} ${user.l_name}\nYour Activation Code for Pickup mtaani is  ${user.verification_code} ` }
            await SendMessage(textbody)
        }

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
            return res.status(400).json({ message: error });;
        }
        const user = await User.findById(req.params.id)
        const password_match = user.comparePassword(req.body.password, user.hashPassword);
        if (!password_match) {
            return res.status(401).json({ message: 'The Previous Password is incorrect!!' });
        }
        let hashPassword = bcrypt.hashSync(body.new_password, 10);
        const Update = await User.findOneAndUpdate({ _id: req.params.id }, { hashPassword }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'User Updated Successfully ', Update });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.put('/reset-password', async (req, res) => {
    try {
        const body = req.body

        const { errors, isValid } = validatePasswordInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0]
            return res.status(400).json({ message: error });
        }

        req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number
        let user = await User.findOne({ phone_number: req.body.phone_number }) || await Rider.findOne({ phone_number: req.body.phone_number });
        // const password_match = await user.comparePassword(req.body.password, user.hashPassword);
        // if (!password_match) {
        //     return res.status(400).json({ success: false, message: 'Kindly enter the exact previous password ' });
        // }

        if (req.body.email) {
            user = await User.findOne({ email: req.body.email }) || await Rider.findOne({ email: req.body.email })
        }
        if (!user) {
            return res.status(400).json({ success: false, message: 'User Not Found ' });
        }
        let hashPassword = bcrypt.hashSync(body.new_password, 10);
        if (user) {

            const Update = await User.findOneAndUpdate({ email: user.email }, { hashPassword: hashPassword }, { new: true, useFindAndModify: false }) || await User.findOneAndUpdate({ email: user.email }, { hashPassword: hashPassword }, { new: true, useFindAndModify: false })
            return res.status(200).json({ success: true, message: 'User Updated Successfully ', Update });
        }

        const Update = await Rider.findOneAndUpdate({ phone_number: user.phone_number }, { hashPassword: hashPassword }, { new: true, useFindAndModify: false }) || await User.findOneAndUpdate({ phone_number: user.phone_number }, { hashPassword: hashPassword }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'User Updated Successfully ', Update });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.post('/recover_account', async (req, res) => {

    try {

        const body = req.body

        if (req.body.phone_number) {
            req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number
            const user = await User.findOne({ phone_number: body.phone_number }) || await Rider.findOne({ phone_number: req.body.phone_number });

            if (!user) {
                return res.status(401).json({ message: 'The phone Number you entered is not registered ' });
            }

            if (req.body.phone_number.charAt(0) === "0") {
                req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number
            }

            let verification_code = MakeActivationCode(5)
            const userUpdate = await User.findOneAndUpdate({ phone_number: req.body.phone_number }, { verification_code }, { new: true, useFindAndModify: false })
            const textbody = { address: `${user.phone_number}`, Body: `Hi ${user.name} \nYour Account Recovery Code for Pickup mtaani is  ${verification_code} ` }
            await SendMessage(textbody)
            return res.status(200).json({ message: `A recovery Text has been sent to  ${req.body.phone_number}` });
        }
        else if (!req.body.phone_number && !req.body.email) {
            return res.status(401).json({ message: 'Kindly enter your email or phone number' });
        }
        else if (req.body.email) {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res.status(401).json({ message: 'The Email you entered is not registered ' });
            }
            let verification_code = await MakeActivationCode(5)
            const mailOptions = {
                from: '"Pickup mtaani" <bradcoupers@gmail.com>',
                to: `${req.body.email}`,
                subject: 'Pickup Mtaani Account Recovery',
                template: 'application',
                context: {
                    email: `${req.body.email}`,
                    name: `${user.f_name} ${user.l_name}`,
                    code: `${verification_code}`,
                }
            };
            const body = req.body
            await transporter.sendMail(mailOptions)
            const userUpdate = await User.findOneAndUpdate({ email: user.email }, { verification_code: verification_code }, { new: true, useFindAndModify: false })
            return res.status(200).json({ success: true, message: `Email sent with a recovery code to ${req.body.email}`, userUpdate });
        }

    } catch (error) {
        console.log("E", error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.post('/:id/yty', async (req, res) => {
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
        if (req.body.phone_number) {
            req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number
        }
        body.updatedAt = new Date();
        const update_user = await User.findOneAndUpdate({ email: body.email }, body, { new: true, useFindAndModify: false })
        return res.status(200).json({ update_user });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.put('/user/:id/activate', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }) || await Rider.findOne({ phone_number: req.body.phone_number });

        if (parseInt(user.verification_code) !== parseInt(req.body.code)) {
            return res.status(400).json({ message: 'Wrong Code kindly re-enter the code correctly' });
        }
        else {
            let userObj = await User.findOneAndUpdate({ _id: req.params.id }, { activated: true }, { new: true, useFindAndModify: false })
            const token = await jwt.sign({ email: userObj.email, _id: user._id }, process.env.JWT_KEY);
            return res.status(200).json({ message: 'User Activated successfully and can now login !!', token });
        }
    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.put('/user/:id/activate-user', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id }) || await Rider.findOne({ phone_number: req.body.phone_number });
        let userObj = await User.findOneAndUpdate({ _id: req.params.id }, { activated: true }, { new: true, useFindAndModify: false })
        const token = await jwt.sign({ email: userObj.email, _id: user._id }, process.env.JWT_KEY);
        return res.status(200).json({ message: 'User Activated successfully and can now login !!', token });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.put('/user/make-super/:id', async (req, res) => {
    try {
        let userObj = await Agent.findOneAndUpdate({ user: req.params.id }, { isSuperAgent: true }, { new: true, useFindAndModify: false })
        let user = await User.findById(req.params.id)
        console.log("User", user)
        return res.status(200).json({ message: ' !!', userObj });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.put('/user/re-activate', async (req, res) => {
    try {
        let user = {}
        if (req.body.phone_number) {
            req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number
            user = await User.findOne({ phone_number: req.body.phone_number }) || await Rider.findOne({ phone_number: req.body.phone_number });
        }
        else if (req.body.email) {
            user = await User.findOne({ email: req.body.email });
        }
        if (parseInt(user.verification_code) !== parseInt(req.body.code)) {
            return res.status(400).json({ message: 'Wrong Code kindly re-enter the code correctly' });
        }
        else if (req.body.phone_number) {
            req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number
            await User.findOneAndUpdate({ phone_number: req.body.phone_number }, { activated: true }, { new: true, useFindAndModify: false })
            return res.status(200).json({ message: 'User ReActivated successfully !!' });
        }
        else if (req.body.email) {
            await User.findOneAndUpdate({ email: req.body.email }, { activated: true }, { new: true, useFindAndModify: false })
            return res.status(200).json({ message: 'User ReActivated successfully !!' });
        }
    } catch (error) {

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

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.get('/user/:id', async (req, res) => {
    try {
        let user
        if (await User.findById(req.params.id)) {
            user = await User.findById(req.params.id)
        }
        else if (await Rider.findById(req.params.id)) {
            user = await Rider.findById(req.params.id)
        }

        return res.status(200).json({ message: 'User Fetched Successfully !!', user });

    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.get('/users', async (req, res) => {

    try {
        const { page, limit, start_date, end_date } = req.query
        const PAGE_SIZE = limit;
        const skip = (page - 1) * PAGE_SIZE;
        let Users
        if (start_date !== undefined && end_date !== undefined) {
            const today = moment(start_date).startOf('day')
            const endDay = moment(end_date).endOf('day')
            Users = await User.find({
                createdAt: {
                    $gte: today.toDate(),
                    $lte: endDay.toDate()
                }
            }).skip(skip).limit(PAGE_SIZE);
        }
        else {
            Users = await User.find().skip(skip).limit(PAGE_SIZE);
        }

        return res.status(200).json({ message: 'Users Fetched Successfully !!', Users });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});


module.exports = router;
