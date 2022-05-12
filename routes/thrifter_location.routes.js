const express = require('express');
var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var ThrifterLocation = require('models/thrifter_location.model')
var jwt = require('jsonwebtoken');

var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();



router.post('/shelf_location', [authMiddleware, authorized], async (req, res) => {
    try {

        const Exists = await ThrifterLocation.findOne({ agent_location: req.body.agent_location });
        if (Exists) {
            return res.status(400).json({ message: 'Loaction  Exists !!' });
        }
        else {
            const body = req.body
            body.user_id = req.user._id
            const newThrifter = new ThrifterLocation(body)

            await newThrifter.save()
            return res.status(200).json({ message: 'Saved' });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.get('/shelf_locations', async (req, res) => {
    try {
        const locations = await ThrifterLocation.find();
        return res.status(200).json({ success: true, message: 'fetched ', locations });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});



module.exports = router;