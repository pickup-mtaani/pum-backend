const express = require('express');
var Route = require('models/routes.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();

router.post('/routes', async (req, res) => {

    try {

        const Exists = await Route.findOne({ name: req.body.name, zone: req.body.zone });
        if (Exists) {
            return res.status(400).json({ message: 'Route Exists !!' });
        }
        else {
            const newRoute = new Route(req.body)
            await newRoute.save()
            return res.status(200).json({ message: 'Saved' });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.get('/routes', async (req, res) => {
    try {
        const routes = await Route.find({ deleted_at: null }).populate(['zone', 'rider']);
        return res.status(200).json(routes);

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
// router.put('/role/:id', async (req, res) => {
//     try {
//         const updateOBj = await Role.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
//         return res.status(200).json({ success: true, message: `Role Updated Successfully`, updateOBj });


//     } catch (error) {

//         return res.status(400).json({ success: false, message: 'operation failed ', error });

//     }

// });

// router.get('/role/:id', async (req, res) => {
//     try {
//         const roleObj = Role.findOne({ _id: req.params.id })
//         return res.status(200).json({ success: true, message: `Role fetched Successfully`, roleObj });


//     } catch (error) {

//         return res.status(400).json({ success: false, message: 'operation failed ', error });

//     }

// });



module.exports = router;