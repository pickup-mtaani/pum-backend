const express = require("express");
var Erand_package = require("models/erand_delivery_packages.model");
var {
    authMiddleware,
    authorized,
} = require("middlewere/authorization.middlewere");

const router = express.Router();

router.get("/errand-shelf-request-packages", [authMiddleware, authorized], async (req, res) => {
    try {
        let { state, id } = req.query

        let packages = await Erand_package.find({ payment_status: "paid", state: state, agent: id })
        console.log(packages)
        let agents_count = {}

        for (let i = 0; i < packages.length; i++) {
            let package = await Erand_package.findOne({ _id: [packages[i]._id] }).populate('businessId')
            agents_count[packages[i]?.businessId?.toString()] = agents_count[packages[i]?.businessId?.toString()] ?
                { packages: [...agents_count[packages[i]?.businessId?.toString()]?.packages, packages[i]._id], name: package.businessId.name }
                : { packages: [packages[i]._id], name: package.businessId.name }
            // agents_count[packages[i].businessId.toString()] = agents_count[packages[i].businessId.toString()] ?
            //     [...agents_count[packages[i].businessId.toString()], { packages: [packages[i]._id], name: package.businessId.name }] : { packages: [packages[i]._id], name: package.businessId.name }
        }
        // ni same kabsa  hii inawork? yap  but iko  package moja  najua maybe zikiwa zaidi rudi kwa hio ingine??????
        return res.status(200)
            .json(agents_count);

    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.get("/errand-shelf-request-packages/:id", [authMiddleware, authorized], async (req, res) => {
    try {
        let { state, id } = req.query
        let packages = await Erand_package.find({ payment_status: "paid", state: state, businessId: req.params.id, agent: id })
            .sort({ createdAt: -1 }).limit(100)
            .populate('createdBy', 'f_name l_name name')
            .populate('agent', 'business_name')
            .populate('businessId')

        return res.status(200)
            .json(packages);

    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});




module.exports = router;