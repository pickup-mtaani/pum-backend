const express = require('express');
var Rider = require('models/rider.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { MakeActivationCode } = require('../helpers/randomNo.helper');
const { SendMessage } = require('../helpers/sms.helper');
const Format_phone_number = require('../helpers/phone_number_formater');
const { validatePasswordInput, validateLoginInput } = require('../va;lidations/user.validations');
var jwt = require('jsonwebtoken');
router.post('/register-rider', async (req, res) => {
  try {
    const body = req.body
    req.body.rider_phone_number = await Format_phone_number(req.body.rider_phone_number) //format the phone number
    body.verification_code = MakeActivationCode(5)
    body.hashPassword = bcrypt.hashSync(body.password, 10);
    const newRider = new Rider(body)
    const saved = await newRider.save()
    const textbody = { address: `${body.rider_phone_number}`, Body: `Hi ${body.rider_name}\nYour Activation Code for Pickup mtaani rider app is  ${body.verification_code} ` }
    await SendMessage(textbody)
    return res.status(200).json({ message: 'Rider Added successfully', saved: saved });

  } catch (error) {
    return res.status(400).json({ success: false, message: 'operation failed ', error });
  }

});

router.post('/:id/resend-token', async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);
    const textbody = { address: `${rider.rider_phone_number}`, Body: `Hi ${rider.rider_name}\nYour Activation Code for Pickup mtaani  app is  ${rider.verification_code} ` }
    await SendMessage(textbody)
    return res.status(200).json({ success: false, message: 'Activation resent ' });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'operation failed ', error });
  }
});

router.put('/rider/:id/activate', async (req, res) => {
  try {
    const rider = await Rider.findOne({ _id: req.params.id });
    if (parseInt(rider.verification_code) !== parseInt(req.body.code)) {
      return res.status(400).json({ message: 'Wrong Code kindly re-enter the code correctly' });
    }
    else {
      let riderObj = await Rider.findOneAndUpdate({ _id: req.params.id }, { activated: true }, { new: true, useFindAndModify: false })
      const token = await jwt.sign({ rider_phone_number: riderObj.rider_phone_number, _id: rider._id }, process.env.JWT_KEY);
      return res.status(200).json({ message: 'rider Activated successfully and can now login !!', token });
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'operation failed ', error });

  }

});
router.post('/rider-login', async (req, res) => {

  try {

    req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number

    const rider = await Rider.findOne({ rider_phone_number: req.body.phone_number })

    if (!rider) {
      return res.status(402).json({ message: 'Authentication failed with wrong credentials!!' });
    }
    if (rider && !rider.activated) {
      return res.status(402).json({ message: 'Your Account is not Activated kindly enter the code sent to your phon via text message' });
    }
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
      let error = Object.values(errors)[0]
      return res.status(400).json({ message: error });
    }

    if (rider) {
      // const password_match = rider.comparePassword(req.body.password, rider.hashPassword);
      // if (!password_match) {
      //   return res.status(402).json({ message: 'Authentication failed with wrong credentials!!', });
      // }
      const token = jwt.sign({ rider_phone_number: rider.rider_phone_number, _id: rider._id }, process.env.JWT_KEY);
      const userUpdate = await Rider.findOneAndUpdate({ rider_phone_number: req.body.phone_number }, { verification_code: null }, { new: true, useFindAndModify: false })

      return res.status(200).json({ token, key: process.env.JWT_KEY, rider_phone_number: rider.rider_phone_number, _id: rider._id });


    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: 'operation failed ', error });

  }

});
router.put('/rider/reset-password', async (req, res) => {
  try {
    const body = req.body
    const { errors, isValid } = validatePasswordInput(req.body);
    if (!isValid) {
      let error = Object.values(errors)[0]
      return res.status(400).json({ message: error });
    }
    let phone = await Format_phone_number(req.body.rider_phone_number)
    let user = await Rider.findOne({ rider_phone_number: phone })

    if (!user) {
      return res.status(400).json({ success: false, message: 'User Not Found ' });
    }
    let hashPassword = bcrypt.hashSync(body.new_password, 10);

    const Update = await Rider.findOneAndUpdate({ rider_phone_number: user.rider_phone_number }, { hashPassword: hashPassword }, { new: true, useFindAndModify: false })
    return res.status(200).json({ success: true, message: 'User Updated Successfully ', Update });

  } catch (error) {
    return res.status(400).json({ success: false, message: 'operation failed ', error });
  }
});

router.post('/rider', [authMiddleware, authorized], async (req, res) => {
  try {
    const body = req.body
    body.createdBy = req.rider._id
    const newRider = new Rider(body)
    const saved = await newRider.save()
    return res.status(200).json({ message: 'Rider Added successfully', saved: saved });

  } catch (error) {

    return res.status(400).json({ success: false, message: 'operation failed ', error });

  }

});


router.get("/riders", [authMiddleware, authorized], async (req, res) => {
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