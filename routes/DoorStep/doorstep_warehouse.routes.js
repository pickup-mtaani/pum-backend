
const express = require("express");
var Door_step_Sent_package = require("models/doorStep_delivery_packages.model");
var {
    authMiddleware,
    authorized,
} = require("middlewere/authorization.middlewere");

const router = express.Router();

router.get("/wh-door-step-packages", [authMiddleware, authorized], async (req, res) => {
    try {
        const agent_packages = await Door_step_Sent_package.find({ state: req.query.state }).sort({ createdAt: -1 }).limit(100).populate('createdBy', 'f_name l_name name phone_number').populate('businessId');
        return res
            .status(200)
            .json(agent_packages);
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.get("/wh-door-step-packages/:id", [authMiddleware, authorized], async (req, res) => {
    try {
        const agent_packages = await Door_step_Sent_package.find({ state: req.query.state, assignedTo: req.params.id }).sort({ createdAt: -1 }).limit(100).populate('createdBy', 'f_name l_name name phone_number').populate('businessId');
        return res
            .status(200)
            .json(agent_packages);
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});

module.exports = router;
