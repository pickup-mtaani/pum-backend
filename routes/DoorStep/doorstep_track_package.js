const express = require("express");
var Track_door_step = require('models/door_step_package_track.model');
var {
    authMiddleware,
    authorized,
} = require("middlewere/authorization.middlewere");

const router = express.Router();
router.get("/door-step/track/packages", [authMiddleware, authorized], async (req, res) => {
    try {
        let packages
        if (req.query.searchKey) {
            var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
            packages = await Track_door_step.find({ $or: [{ reciept: searchKey }] }).sort({ createdAt: -1 }).limit(100)
                .populate('package')
            // .populate("collectedby")
            // .populate("droppedTo")
            return res.status(200)
                .json(packages);
        } else {
            packages = await Track_door_step.find().sort({ createdAt: -1 }).limit(100)
                .populate({
                    path: 'package',
                    populate: {
                        path: 'agent',
                    }
                })
                // .populate("collectedby")
                .populate({
                    path: 'package',
                    populate: {
                        path: 'businessId',
                    },

                    populate: {
                        path: 'assignedTo'
                    },
                })
            return res.status(200)
                .json(packages);
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.get("/door/switchboard-search", [authMiddleware, authorized], async (req, res) => {
    try {
        console.log(req.query)
        let packages
        if (req.query.searchKey) {
            var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
            packages = await Track_door_step.find({ $or: [{ reciept: searchKey }] }).sort({ createdAt: -1 }).limit(100)
                .populate({
                    path: 'package',
                    populate: {
                        path: 'agent',
                    }
                })
                // .populate("collectedby")
                .populate({
                    path: 'package',
                    populate: {
                        path: 'businessId',
                    },

                    populate: {
                        path: 'assignedTo'
                    },
                })
            return res.status(200)
                .json(packages);
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.get("/door-step/track/packages/:id", [authMiddleware, authorized], async (req, res) => {
    try {
        let packages
        if (req.query.searchKey) {
            var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
            packages = await Track_door_step.findOne({ package: req.params.id, $or: [{ reciept: searchKey }] }).sort({ createdAt: -1 }).limit(100)
                .populate('package')
            // .populate("collectedby")
            // .populate("droppedTo")
            return res.status(200)
                .json(packages);
        } else {
            packages = await Track_door_step.findOne({ package: req.params.id }).sort({ createdAt: -1 }).limit(100)

                .populate('package')
                // .populate("collectedby")
                .populate({
                    path: 'package',
                    populate: {
                        path: 'businessId',
                    },
                    populate: {
                        path: 'agent',
                    },
                    populate: {
                        path: 'assignedTo'
                    },
                })
            return res.status(200)
                .json(packages);
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});

module.exports = router;
