const express = require('express');
var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var User = require('models/user.model')
var Zone = require('models/zones.model')
var jwt = require('jsonwebtoken');

var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();
const uploadFile = require("middlewere/upload.middleware");



router.post('/zones', [authMiddleware, authorized], async (req, res) => {
    try {
        const Exists = await Zone.findOne({ name: req.body.name });
        if (Exists) {
            return res.status(400).json({ message: 'Zone  Exists !!' });
        }
        else {
            const body = req.body;
            body.user_id = req.user._id
            const newZone = new Zone(req.body)
            await newZone.save()
            return res.status(200).json({ message: 'Saved' });
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.get('/zones', [authMiddleware, authorized], async (req, res) => {
    try {
        const Zones = await Zone.find();
        return res.status(200).json({ message: 'Saved', Zones });

    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});







module.exports = router;