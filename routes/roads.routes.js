const express = require('express');
var Road = require('models/roads.model')
var ZonePrice = require('models/zone_pricing.model')
var Doorstep = require('models/doorsteps.model')
var moment = require('moment');
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const { DATE } = require('sequelize');
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

// Create Zone Pricing
router.post('/zone_price', async (req, res) => {
    try {
        const Exists = await ZonePrice.findOne({ name: req.body.name });
        if (Exists) {
            return res.status(400).json({ message: 'Zone priciing set already !!' });
        }
        else {
            const newZonePrice = await new ZonePrice(req.body).save()

            return res.status(200).json(newZonePrice);
        }
    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
// Crete Zone Pricing
router.get('/zone_price', async (req, res) => {
    try {
        const zones = await ZonePrice.find({ deleted_at: null });
        return res.status(200).json(zones);

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.get('/interzone_charges', async (req, res) => {
    try {
        let { name } = req.query
        const zones = await ZonePrice.findOne({ deleted_at: null, name: name });
        return res.status(200).json(zones.price);

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.put('/zone_price/:id', async (req, res) => {
    try {
        const updateOBj = await ZonePrice.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: `Role Updated Successfully`, updateOBj });


    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.put('/zone_price/soft_delete/:id', async (req, res) => {
    try {
        const updateOBj = await ZonePrice.findOneAndUpdate({ _id: req.params.id }, { deleted_at: moment() }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: `Role Updated Successfully`, updateOBj });


    } catch (error) {
        console.log(error)
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


        let steps = await Doorstep.find({ deleted_at: null }).populate('road', 'name');
        let road_count = {}


        // for (let i = 0; i < steps.length; i++) {

        //     // road_count[steps[i].road._id.toString()] === road_count[steps[i].road._id.toString()] ? [...road_count[steps[i].road.name], { name: steps[i].name, price: steps[i].price }] : [{ name: steps[i].name, price: steps[i].price }]
        //     // road_count[steps[i].road.toString()] = road_count[steps[i].road.toString()] ? [...road_count[steps[i].road.toString()], { road: steps[i].road.name, name: steps[i].name }] : [steps[i].road.name]

        // }
        // console.log(road_count)
        return res.status(200).json(Exists);
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});

router.put('/doorstep-destinations/:id', async (req, res) => {
    try {
        const updateOBj = await Doorstep.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: `Role Updated Successfully`, updateOBj });


    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.put('/doorstep-destinations/soft_delete/:id', async (req, res) => {
    try {
        const updateOBj = await Doorstep.findOneAndUpdate({ _id: req.params.id }, { deleted_at: moment() }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, message: `Role Updated Successfully`, updateOBj });


    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});






module.exports = router;