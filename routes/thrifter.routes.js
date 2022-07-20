const express = require('express');
var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Thrifter = require('models/thrifter.model')
var User = require('models/user.model')
var Role = require('models/roles.model')
var jwt = require('jsonwebtoken');

var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();
const uploadFile = require("middlewere/upload.middleware");



router.post('/thrifter', [authMiddleware, authorized], async (req, res) => {
    try {

        const Exists = await Thrifter.findOne({ name: req.body.name });
        const RoleOb = await Role.findOne({ name: "Thrifter" });
        if (Exists) {
            return res.status(400).json({ message: 'Thrifter  Exists !!' });
        }
        else {
            const body = req.body;
            body.user_id = req.user._id
            const newThrifter = new Thrifter(req.body)
            await newThrifter.save()
            await User.findOneAndUpdate({ _id: req.user._id }, { role: RoleOb._id }, { new: true, useFindAndModify: false })

            return res.status(200).json({ message: 'Saved' });
        }
    } catch (error) {

        console.log('error4')
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});







module.exports = router;