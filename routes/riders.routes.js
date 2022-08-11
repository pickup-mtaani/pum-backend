const express = require('express');
var Rider = require('models/rider.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();



router.post('/rider', [authMiddleware, authorized],async (req, res) => {
    try {
        const body = req.body
        body.createdBy = req.user._id
        const newRider = new Rider(body)
        const saved = await newRider.save()
        return res.status(200).json({ message: 'Rider Added successfully', saved: saved });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});


router.get("/riders", [authMiddleware, authorized],async (req, res) => {
    try {
      const riders = await Rider.find({})
      return res.status(200).json({ message: "Fetched Sucessfully", riders });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "operation failed ", error });
    }
  });



module.exports = router;