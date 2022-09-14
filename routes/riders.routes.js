const express = require('express');
var Rider = require('models/rider.model')
var Rider_Package = require('models/rider_package.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();
var User = require('models/user.model')
var Package = require('models/package.modal')
const { MakeActivationCode } = require('../helpers/randomNo.helper');
const { SendMessage } = require('../helpers/sms.helper');
const { validatePasswordInput, validateLoginInput, validateRiderRegisterInput } = require('../va;lidations/user.validations');
var Sent_package = require("models/package.modal.js");
const { v4: uuidv4 } = require('uuid');
var multer = require('multer');
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


// router.post('/register-rider', async (req, res) => {
//   try {
//     let user
//     let rider
//     if (req.body.phone_number) {
//       req.body.phone_number = await Format_phone_number(req.body.phone_number) //format the phone number
//       user = await User.findOne({ phone_number: req.body.phone_number })

//       rider = await Rider.findOne({ phone_number: req.body.phone_number })
//     }
//     if (user || rider) {
//       return res.status(400).json({ success: false, message: 'The phone No you entered is already used by another account' });
//     }
//     const { errors, isValid } = validateRiderRegisterInput(req.body);
//     if (!isValid) {
//       let error = Object.values(errors)[0]
//       return res.status(400).json({ message: error });
//     }
//     const body = req.body

//     body.verification_code = MakeActivationCode(5)
//     body.hashPassword = bcrypt.hashSync(body.password, 10);
//     const newRider = new Rider(body)
//     const saved = await newRider.save()

//     const textbody = { address: `${body.phone_number}`, Body: `Hi ${body.rider_name}\nYour Activation Code for Pickup mtaani rider app is  ${body.verification_code} ` }
//     await SendMessage(textbody)
//     return res.status(200).json({ message: 'Rider Added successfully', saved: saved });

//   } catch (error) {
//     console.log(error)
//     return res.status(400).json({ success: false, message: 'operation failed ', error });
//   }

// });

// router.post('/rider/:id/resend-token', async (req, res) => {
//   try {
//     const rider = await Rider.findById(req.params.id);
//     const textbody = { address: `${rider.phone_number}`, Body: `Hi ${rider.rider_name}\nYour Activation Code for Pickup mtaani  app is  ${rider.verification_code} ` }
//     await SendMessage(textbody)
//     return res.status(200).json({ success: false, message: 'Activation resent ' });
//   } catch (error) {
//     return res.status(400).json({ success: false, message: 'operation failed ', error });
//   }
// });

// router.put('/rider/:id/activate', async (req, res) => {
//   try {
//     const rider = await Rider.findOne({ _id: req.params.id });
//     if (parseInt(rider.verification_code) !== parseInt(req.body.code)) {
//       return res.status(400).json({ message: 'Wrong Code kindly re-enter the code correctly' });
//     }
//     else {
//       let riderObj = await Rider.findOneAndUpdate({ _id: req.params.id }, { activated: true }, { new: true, useFindAndModify: false })
//       const token = await jwt.sign({ phone_number: riderObj.phone_number, _id: rider._id }, process.env.JWT_KEY);
//       return res.status(200).json({ message: 'rider Activated successfully and can now login !!', token });
//     }
//   } catch (error) {
//     console.log(error)
//     return res.status(400).json({ success: false, message: 'operation failed ', error });

//   }

// });

// router.put('/rider/reset-password', async (req, res) => {
//   try {
//     const body = req.body
//     const { errors, isValid } = validatePasswordInput(req.body);
//     if (!isValid) {
//       let error = Object.values(errors)[0]
//       return res.status(400).json({ message: error });
//     }
//     let phone = await Format_phone_number(req.body.phone_number)
//     let user = await Rider.findOne({ phone_number: phone })

//     if (!user) {
//       return res.status(400).json({ success: false, message: 'User Not Found ' });
//     }
//     let hashPassword = bcrypt.hashSync(body.new_password, 10);

//     const Update = await Rider.findOneAndUpdate({ phone_number: user.phone_number }, { hashPassword: hashPassword }, { new: true, useFindAndModify: false })
//     return res.status(200).json({ success: true, message: 'User Updated Successfully ', Update });

//   } catch (error) {
//     return res.status(400).json({ success: false, message: 'operation failed ', error });
//   }
// });


router.post('/update-rider-avatar', [authMiddleware, authorized], upload.single('rider_avatar'), async (req, res) => {
  try {
    const rider = await Rider.findOne({ user: req.user._id })
    let userOBJ = await User.findOne({ phone_number: req.body.phone_number })
    const url = req.protocol + '://' + req.get('host');
    if (req.file) {
      const body = req.body
      body.rider_avatar = url + '/uploads/rider_avatar/' + req.file.filename

      if (rider) {
        const Update = await Rider.findOneAndUpdate({ user: req.user._id }, { rider_avatar: req.body.rider_avatar }, { new: true, useFindAndModify: false })
        let user = {}
        user.bike_reg_plate = Update.bike_reg_plate
        user.rider_avatar = Update.rider_avatar
        user.rider_licence_photo = Update.rider_licence_photo
        user.rider_id_front = Update.rider_id_front
        user.name = userOBJ.name
        user.phone_number = userOBJ.phone_number
        user.email = userOBJ.email
        user.role = userOBJ.role
        return res.status(200).json({ success: true, message: 'Rider Updated Successfully ', user });
      } else {
        const Update = await new Rider({ rider_avatar: req.body.rider_avatar, user: req.user._id }).save()
        let user = {}
        user.bike_reg_plate = Update.bike_reg_plate
        user.rider_avatar = Update.rider_avatar
        user.rider_licence_photo = Update.rider_licence_photo
        user.rider_id_front = Update.rider_id_front
        user.name = userOBJ.name
        user.phone_number = userOBJ.phone_number
        user.email = userOBJ.email
        user.role = userOBJ.role
        return res.status(200).json({ message: 'Saved', user });
      }
    }

  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'operation failed ', error });
  }
});
router.post('/update-rider-id-front', [authMiddleware, authorized], uploadrider_id_front.single('rider_id_front'), async (req, res) => {
  try {
    const url = req.protocol + '://' + req.get('host');
    const rider = await Rider.findOne({ user: req.user._id })
    let userOBJ = await User.findOne({ phone_number: req.body.phone_number })
    let user = {}
    if (req.file) {
      if (rider) {
        const body = req.body
        body.rider_id_front = url + '/uploads/Ids/' + req.file.filename

        const Update = await Rider.findOneAndUpdate({ _id: req.user._id }, { rider_id_front: req.body.rider_id_front }, { new: true, useFindAndModify: false })
        user.bike_reg_plate = Update.bike_reg_plate
        user.rider_avatar = Update.rider_avatar
        user.rider_licence_photo = Update.rider_licence_photo
        user.rider_id_front = Update.rider_id_front
        user.name = userOBJ.name
        user.phone_number = userOBJ.phone_number
        user.email = userOBJ.email
        user.role = userOBJ.role
        return res.status(200).json({ success: true, message: 'Rider Updated Successfully ', user });
      } else {
        const Update = await new Rider({ rider_avatar: req.body.rider_id_front, user: req.user._id }).save()
        user.bike_reg_plate = Update.bike_reg_plate
        user.rider_avatar = Update.rider_avatar
        user.rider_licence_photo = Update.rider_licence_photo
        user.rider_id_front = Update.rider_id_front
        user.name = userOBJ.name
        user.phone_number = userOBJ.phone_number
        user.email = userOBJ.email
        user.role = userOBJ.role
        return res.status(200).json({ message: 'Saved', user });
      }
    }

  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'operation failed ', error });
  }
});
router.post('/update-rider-licence', [authMiddleware, authorized], uploadrider_licence_photo.single('rider_licence_photo'), async (req, res) => {
  try {
    const url = req.protocol + '://' + req.get('host');
    const rider = await Rider.findOne({ user: req.user._id })
    let userOBJ = await User.findOne({ phone_number: req.body.phone_number })
    let user = {}
    if (req.file) {
      if (rider) {
        const body = req.body
        body.rider_licence_photo = url + '/uploads/licence/' + req.file.filename

        const Update = await Rider.findOneAndUpdate({ _id: req.user._id }, { rider_licence_photo: req.body.rider_licence_photo }, { new: true, useFindAndModify: false })
        user.bike_reg_plate = Update.bike_reg_plate
        user.rider_avatar = Update.rider_avatar
        user.rider_licence_photo = Update.rider_licence_photo
        user.rider_id_front = Update.rider_id_front
        user.name = userOBJ.name
        user.phone_number = userOBJ.phone_number
        user.email = userOBJ.email
        user.role = userOBJ.role
        return res.status(200).json({ success: true, message: 'Rider Updated Successfully ', user });
      }
      else {
        const Update = await new Rider({ rider_avatar: req.body.rider_licence_photo, user: req.user._id }).save()
        user.bike_reg_plate = Update.bike_reg_plate
        user.rider_avatar = Update.rider_avatar
        user.rider_licence_photo = Update.rider_licence_photo
        user.rider_id_front = Update.rider_id_front
        user.name = userOBJ.name
        user.phone_number = userOBJ.phone_number
        user.email = userOBJ.email
        user.role = userOBJ.role
        return res.status(200).json({ message: 'Saved', user });
      }
    }

  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'operation failed ', error });
  }
});

router.post('/update-rider', [authMiddleware, authorized], async (req, res) => {

  try {
    const rider = await Rider.findOne({ user: req.user._id })
    let userOBJ = await User.findOne({ phone_number: req.body.phone_number })
    let user = {}
    const body = req.body
    if (rider) {

      const Update = await Rider.findOneAndUpdate({ _id: req.user._id }, body, { new: true, useFindAndModify: false })
      user.bike_reg_plate = Update.bike_reg_plate
      user.rider_avatar = Update.rider_avatar
      user.rider_licence_photo = Update.rider_licence_photo
      user.rider_id_front = Update.rider_id_front
      user.name = userOBJ.name
      user.phone_number = userOBJ.phone_number
      user.email = userOBJ.email
      user.role = userOBJ.role
      return res.status(200).json({ success: true, message: 'Rider Updated Successfully ', user });
    }
    else {
      body.user = req.user._id
      const Update = await new Rider(body).save()
      user.bike_reg_plate = Update.bike_reg_plate
      user.rider_avatar = Update.rider_avatar
      user.rider_licence_photo = Update.rider_licence_photo
      user.rider_id_front = Update.rider_id_front
      user.name = userOBJ.name
      user.phone_number = userOBJ.phone_number
      user.email = userOBJ.email
      user.role = userOBJ.role
      return res.status(200).json({ message: 'Saved', user });
    }
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
    const riders = await Rider.find({}).populate('user')
    return res.status(200).json({ message: "Fetched Sucessfully", riders });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

router.post("/assign-riders", async (req, res) => {
  try {

    const riders = await new Rider_Package(req.body).save()
    const packOwner = await Package.findById(req.body.package)
    const rider = await Rider.findOne({ user: req.body.rider })

    let chatmates = rider.chat_mates
    if (!rider.chat_mates.includes(packOwner.createdBy)) {
      chatmates.push(packOwner.createdBy)
    }
    await Rider.findOneAndUpdate({ user: req.body.rider }, { chat_mates: chatmates }, { new: true, useFindAndModify: false })
    return res.status(200).json({ message: "Fetched Sucessfully", riders });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

router.get("/assigned-packages", [authMiddleware, authorized], async (req, res) => {
  try {
    const packages = await Rider_Package.find({ rider: req.user._id }).populate({
      path: "package",
      populate: [
        {
          path: "receieverAgentID",
          // select: "loc",
        },
        {
          path: "senderAgentID",
          // select: "loc",
        },
        {
          path: "createdBy",
          // select: "loc",
        },
      ],
    })
    return res.status(200).json({ message: "Fetched Sucessfully", packages });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});

router.get("/assigned-packages/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    const packages = await Rider_Package.find({ rider: req.params.id }).populate({
      path: "package",
      populate: [
        {
          path: "receieverAgentID",
          // select: "loc",
        },
        {
          path: "senderAgentID",
          // select: "loc",
        },
        {
          path: "createdBy",
          // select: "loc",
        },
      ],
    })
    return res.status(200).json({ message: "Fetched Sucessfully", packages });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});



module.exports = router;