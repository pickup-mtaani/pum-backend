const express = require('express');
var Agent = require('models/agents.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();



router.post('/agent', [authMiddleware, authorized], async (req, res) => {
    try {

        const Exists = await Agent.findOne({ name: req.body.name });
        if (Exists) {
            return res.status(400).json({ message: 'Agent Exists !!' });
        }
        else {
            const body = req.body
            body.createdBy = req.user._id
            const newAgent = new Agent(body)
            const saved = await newAgent.save()
            return res.status(200).json({ message: 'Agent Added successfully', saved: saved });
        }


    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});



module.exports = router;