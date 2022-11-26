
const express = require('express');
var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Admin = require('models/admin.model')
var Employee = require('models/user.model')
var Agent = require('models/agentAddmin.model')
var AgentUser = require('models/agent_user.model')
var Role = require('models/roles.model')
var moment = require('moment');
var jwt = require('jsonwebtoken');
const { MakeActivationCode } = require('../helpers/randomNo.helper');
const { SendMessage } = require('../helpers/sms.helper');
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
var transporter = require('../helpers/transpoter');
var { validateAdminRegisterInput, validateLoginInput, validatePasswordInput } = require('./../va;lidations/user.validations')
// var { authMiddleware, authorized } = require('./../common/authrized');
const router = express.Router();
var Format_phone_number = require('./../helpers/phone_number_formater')
router.post('/register', [authMiddleware, authorized], async (req, res) => {
    try {
        const body = req.body
        req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number
        const user = await Admin.findOne({ email: req.body.email });
        const phone = await Admin.findOne({ phone_number: req.body.phone_number });
        if (user || phone) {
            return res.status(402).json({ message: 'Admin Exists !!' });
        }
        const { errors, isValid } = validateAdminRegisterInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0]
            return res.status(400).json({ message: error });
        }
        body.hashPassword = bcrypt.hashSync(body.password, 10);
        // body.createdBy = req.user._id
        let newAdmin = new Admin(body);
        const saved = await newAdmin.save();
        return res.status(200).json({ message: 'User Saved Successfully !!', saved });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.post('/login', async (req, res) => {

    try {

        req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number
        const user = await Admin.findOne({ phone_number: req.body.phone_number })

        const { errors, isValid } = validateLoginInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0]
            return res.status(400).json({ message: error });
        }
        if (!user) {

            return res.status(400).json({ message: "Authentication failed with wrong credentials!!" });
        }
        if (user) {
            const password_match = user.comparePassword(req.body.password, user.hashPassword);

            if (!password_match) {
                return res.status(402).json({ message: 'Authentication failed with wrong credentials!!', user });
            }
            const token = await jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_KEY);
            return res.status(200).json({ token, key: process.env.JWT_KEY, email: user.email, _id: user._id, role: user.role });
        }
    } catch (error) {

        return res.status(400).json({ success: false, message: 'Operation failed ', error });
    }

});

router.post('/add-user-to-agent/:id', [authMiddleware, authorized], async (req, res) => {

    try {
        console.log("LOGS", req.body)
        const body = req.body
        req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number
        const user = await Employee.findOne({ email: req.body.email, agent_id: req.params.id, role: req.body.role });
        const phone = await Employee.findOne({ phone_number: req.body.phone_number, agent_id: req.params.id, role: req.body.role });
        if (user || phone) {
            return res.status(402).json({ message: 'Employee Exists !!' });
        }
        const { errors, isValid } = validateAdminRegisterInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0]
            return res.status(400).json({ message: error });
        }
        body.hashPassword = bcrypt.hashSync(body.password, 10);
        body.createdBy = req.user._id
        body.agent_id = req.params.id
        body.isSubAgent = true
        body.activated = true
        // body.agent = req.params.id
        let newemployee = await new Employee(body);

        const saved = await newemployee.save();

        await new AgentUser({
            agent: req.params.id,
            user: saved._id,
            role: req.body.role
        }).save()

        return res.status(200).json({ message: 'User Saved Successfully !!', saved });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.get('/', [authMiddleware, authorized], async (req, res) => {
    try {
        const { page, limit, date } = req.query
        const PAGE_SIZE = limit;
        const skip = (page - 1) * PAGE_SIZE;
        let Admins
        if (date) {
            const today = moment(date).startOf('day')
            Admins = await Admin.find({
                createdAt: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate()
                }
            }).populate('role').skip(skip).limit(PAGE_SIZE);
        }
        else {
            Admins = await Admin.find({}).populate('createdBy').skip(skip).limit(PAGE_SIZE);
        }

        return res.status(200).json({ message: 'Admins Fetched Successfully !!', Admins });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.get('/all-employees/:id', async (req, res) => {
    try {
        let emp = await AgentUser.find({ agent: req.params.id }).populate('user');

        return res.status(200).json(emp);

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.get('/employees/:id', async (req, res) => {
    try {
        let emp = await AgentUser.find({ agent: req.params.id, role: "agent" }).populate('user');

        return res.status(200).json(emp);

    } catch (error) {

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
        let user
        if (req.body.email) {
            user = await Admin.findOne({ email: req.body.email })
        } else {
            req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number
            user = await Admin.findOne({ phone_number: req.body.phone_number })
        }
        if (!user) {
            return res.status(400).json({ success: false, message: 'User Not Found ' });
        }
        let hashPassword = bcrypt.hashSync(body.new_password, 10);
        if (req.body.email) {
            const Update = await Admin.findOneAndUpdate({ email: user.email }, { hashPassword: hashPassword }, { new: true, useFindAndModify: false })
            return res.status(200).json({ success: true, message: 'User Updated Successfully ', Update });
        }
        const Update = await Admin.findOneAndUpdate({ phone_number: user.phone_number }, { hashPassword: hashPassword }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: 'User Updated Successfully ', Update });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});

module.exports = router;