const express = require("express");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
var Sent_package = require("models/package.modal.js");
var Erand_package = require("models/erand_delivery_packages.model");
var {
    authMiddleware,
    authorized,
} = require("middlewere/authorization.middlewere");

const router = express.Router();

router.get("/doorstep-shelf-request-packages", [authMiddleware, authorized], async (req, res) => {
    try {

        let { state, id, type } = req.query
        // console.log
        let packages = await Door_step_Sent_package.find({ payment_status: "paid", state: state, agent: id })
        let agents_count = {}
        for (let i = 0; i < packages.length; i++) {
            let package = await Door_step_Sent_package.findOne({ _id: [packages[i]._id] }).populate('businessId')
            console.log(packages[i])
            agents_count[packages[i].businessId.toString()] = agents_count[packages[i].businessId.toString()] ?
                [...agents_count[packages[i].businessId.toString()], { packages: [packages[i]._id], name: package.businessId.name }] : [packages[i]._id]
        }
        return res.status(200)
            .json(agents_count);

    } catch (error) {
        console.log("***********************Error***************")
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.get("/doorstep-shelf-request-packages/:id", [authMiddleware, authorized], async (req, res) => {
    try {
        let { state, id, type } = req.query
        let packages
        packages = await Door_step_Sent_package.find({ payment_status: "paid", state: state, businessId: req.params.id, agent: id })
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