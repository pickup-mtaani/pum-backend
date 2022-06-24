const express = require('express');
var Role = require('models/roles.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();

router.post('/role', async (req, res) => {
    try {

        const Exists = await Role.findOne({ name: req.body.name });
        if (Exists) {
            return res.status(400).json({ message: ']Role Exists !!' });
        }
        else {
            const newRole = new Role(req.body)
            await newRole.save()
            return res.status(200).json({ message: 'Saved' });
        }


    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.get('/roles', async (req, res) => {
    try {
        const roles = await Role.find({ deleted_at: null });
        return res.status(200).json({ message: 'roles', roles });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});



module.exports = router;