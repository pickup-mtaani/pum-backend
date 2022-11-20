const express = require('express');
var Role = require('models/roles.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();

router.post('/roles', async (req, res) => {

    try {

        const Exists = await Role.findOne({ name: req.body.name });
        if (Exists) {
            return res.status(400).json({ message: 'Role Exists !!' });
        }
        else {
            const newRole = new Role(req.body)
            await newRole.save()
            return res.status(200).json({ message: 'Saved' });
        }
    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.post('/sockets', async (req, res) => {

    try {
        if (!req.body.lat || !req.body.lng) {
            res.status(400).json({ success: false, message: 'Please provide full lat and lng' })
        }
        global.io.emit("change-coord", { lat: parseFloat(req.body.lat), lng: parseFloat(req.body.lng) })
        return res.status(200).json(req.body)
    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.get('/roles', async (req, res) => {
    try {
        const roles = await Role.find({ deleted_at: null });
        return res.status(200).json({ message: 'roles', roles });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.put('/role/:id', async (req, res) => {
    try {
        const updateOBj = await Role.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: `Role Updated Successfully`, updateOBj });


    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});

router.get('/role/:id', async (req, res) => {
    try {
        const roleObj = Role.findOne({ _id: req.params.id })
        return res.status(200).json({ success: true, message: `Role fetched Successfully`, roleObj });


    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});



module.exports = router;