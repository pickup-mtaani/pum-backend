const express = require("express");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
var Sent_package = require("models/package.modal.js");
var Erand_package = require("models/erand_delivery_packages.model");
var {
    authMiddleware,
    authorized,
} = require("middlewere/authorization.middlewere");

const router = express.Router();

router.get("/shelf-request-packages", [authMiddleware, authorized], async (req, res) => {
    try {

        let { state, id, type } = req.query
        console.log(req.query)

        if (type === "doorstep") {

            let packages = await Door_step_Sent_package.find({ payment_status: "paid", state: state, agent: id })
            let agents_count = {}
            for (let i = 0; i < packages.length; i++) {
                let package = await Door_step_Sent_package.findOne({ _id: [packages[i]._id] }).populate('businessId')

                agents_count[packages[i].businessId.toString()] = agents_count[packages[i].businessId.toString()] ?
                    [...agents_count[packages[i].businessId.toString()], { packages: [packages[i]._id], name: package.businessId.name }] : { packages: [packages[i]._id], name: package.businessId.name }
            }
            return res.status(200)
                .json(agents_count);
        }
        else if (type === "errand") {
            let agents_count = {}
            let packages = await Erand_package.find({ payment_status: "paid", state: state, agent: id })
            for (let i = 0; i < packages.length; i++) {
                let package = await Erand_package.findOne({ _id: [packages[i]._id] }).populate('businessId')

                agents_count[packages[i].businessId.toString()] = agents_count[packages[i].businessId.toString()] ?
                    [...agents_count[packages[i].businessId.toString()], { packages: [packages[i]._id], name: package.businessId.name }] : { packages: [packages[i]._id], name: package.businessId.name }
            }

            return res.status(200)
                .json(agents_count);
        } else if (type === "agent") {

            let packages = await Sent_package.find({ payment_status: "paid", state: state, senderAgentID: id })
            let agents_count = {}
            for (let i = 0; i < packages.length; i++) {
                let package = await Sent_package.findOne({ _id: [packages[i]._id] }).populate('businessId')

                agents_count[packages[i].businessId.toString()] = agents_count[packages[i].businessId.toString()] ?
                    [...agents_count[packages[i].businessId.toString()], { packages: [packages[i]._id], name: package.businessId.name }] : { packages: [packages[i]._id], name: package.businessId.name }
            }

            return res.status(200)
                .json(agents_count);
        }


    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.get("/shelf-request-packages/:id", [authMiddleware, authorized], async (req, res) => {
    try {
        let { state, id, type } = req.query
        let packages
        console.log(req.query)
        if (type === "doorstep") {
            packages = await Door_step_Sent_package.find({ payment_status: "paid", state: state, businessId: req.params.id, agent: id })
                .sort({ createdAt: -1 }).limit(100)
                .populate('createdBy', 'f_name l_name name')
                .populate('agent', 'business_name')
                .populate('businessId')
        }
        if (type === "errand") {
            let packages = await Erand_package.find({ payment_status: "paid", state: state, businessId: req.params.id, agent: id })
                .sort({ createdAt: -1 }).limit(100)
                .populate('createdBy', 'f_name l_name name')
                .populate('agent', 'business_name')
                .populate('businessId')

            return res.status(200)
                .json(packages);
        }
        if (type === "agent") {
            packages = await Sent_package.find({ payment_status: "paid", state: state, businessId: req.params.id, senderAgentID: id })
                .sort({ createdAt: -1 }).limit(100)
                .populate('createdBy', 'f_name l_name name')
                .populate('receieverAgentID', 'business_name')
                .populate('senderAgentID', 'business_name')
                .populate('businessId')

        }
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