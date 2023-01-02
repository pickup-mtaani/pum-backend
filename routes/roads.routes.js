const express = require('express');
var Road = require('models/roads.model')
var Doorstep = require('models/doorsteps.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();

router.post('/roads', async (req, res) => {
    try {
        const Exists = await Road.findOne({ name: req.body.name });
        if (Exists) {
            return res.status(400).json({ message: 'Road Exists !!' });
        }
        else {
            const newRoad = new Road(req.body)
            await newRoad.save()
            return res.status(200).json({ message: 'Saved' });
        }
    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});

router.get('/roads', async (req, res) => {
    try {
        const roads = await Road.find({ deleted_at: null });
        return res.status(200).json(roads);

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});

// Doorsteps
router.post('/doorstep-destinations', async (req, res) => {

    try {
        console.log(req.body)
        const Exists = await Doorstep.findOne({ name: req.body.name, road: req.body.road });
        if (Exists) {
            return res.status(400).json({ message: 'Road Exists !!' });
        }
        else {
            const newRoad = new Doorstep(req.body)
            await newRoad.save()
            return res.status(200).json({ message: 'Saved' });
        }
    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});

router.get('/doorstep-destinations', async (req, res) => {

    try {

        const Exists = await Doorstep.find().populate('road', 'name');

        return res.status(200).json(Exists);
    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});






module.exports = router;