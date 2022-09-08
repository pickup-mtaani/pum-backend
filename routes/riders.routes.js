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
var User = require('models/user.model')
const { v4: uuidv4 } = require('uuid');
var multer = require('multer');
const fs = require('fs');
var path = require('path');
const storagerider_id_front = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + './../uploads/Ids');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuidv4() + '-' + fileName)
  }
});

var uploadrider_id_front = multer({
  storage: storagerider_id_front,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

const storagerider_licence_photo = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + './../uploads/licence');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuidv4() + '-' + fileName)
  }
});

var uploadrider_licence_photo = multer({
  storage: storagerider_licence_photo,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + './../uploads/rider_avatar');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuidv4() + '-' + fileName)
  }
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});
router.post('/register-rider', async (req, res) => {
  try {
    req.body.rider_phone_number = await Format_phone_number(req.body.rider_phone_number) //format the phone number
    const user = await User.findOne({ phone_number: req.body.rider_phone_number })

    const rider = await Rider.findOne({ rider_phone_number: req.body.rider_phone_number })

    if (user || rider) {
      return res.status(400).json({ success: false, message: 'The phone No you entered is already used by another account' });
    }

    const body = req.body

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

router.post('/rider/:id/resend-token', async (req, res) => {
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


router.post('/update-rider-avatar', [authMiddleware, authorized], upload.single('rider_avatar'), async (req, res) => {


  try {

    const url = req.protocol + '://' + req.get('host');


    if (req.file) {

      const body = req.body
      body.rider_avatar = url + '/uploads/rider_avatar/' + req.file.filename

      const Update = await Rider.findOneAndUpdate({ _id: req.user._id }, { rider_avatar: req.body.rider_avatar }, { new: true, useFindAndModify: false })
      return res.status(200).json({ success: true, message: 'Rider Updated Successfully ', Update });

    }



    return res.status(200).json({ message: 'Saved', biz });


  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'operation failed ', error });
  }
});
router.post('/update-rider-id-front', [authMiddleware, authorized], uploadrider_id_front.single('rider_id_front'), async (req, res) => {


  try {

    const url = req.protocol + '://' + req.get('host');


    if (req.file) {

      const body = req.body
      body.rider_id_front = url + '/uploads/Ids/' + req.file.filename

      const Update = await Rider.findOneAndUpdate({ _id: req.user._id }, { rider_id_front: req.body.rider_id_front }, { new: true, useFindAndModify: false })
      return res.status(200).json({ success: true, message: 'Rider Updated Successfully ', Update });

    }



    return res.status(200).json({ message: 'Saved', biz });


  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'operation failed ', error });
  }
});
router.post('/update-rider-licence', [authMiddleware, authorized], uploadrider_licence_photo.single('rider_licence_photo'), async (req, res) => {


  try {

    const url = req.protocol + '://' + req.get('host');


    if (req.file) {

      const body = req.body
      body.rider_licence_photo = url + '/uploads/licence/' + req.file.filename

      const Update = await Rider.findOneAndUpdate({ _id: req.user._id }, { rider_licence_photo: req.body.rider_licence_photo }, { new: true, useFindAndModify: false })
      return res.status(200).json({ success: true, message: 'Rider Updated Successfully ', Update });

    }



    return res.status(200).json({ message: 'Saved', biz });


  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'operation failed ', error });
  }
});

router.post('/update-rider', [authMiddleware, authorized], async (req, res) => {

  try {
    const body = req.body

    const Update = await Rider.findOneAndUpdate({ _id: req.user._id }, body, { new: true, useFindAndModify: false })
    return res.status(200).json({ success: true, message: 'Rider Updated Successfully ', Update });

  } catch (error) {
    console.log(error)
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


router.get("/riders", async (req, res) => {
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