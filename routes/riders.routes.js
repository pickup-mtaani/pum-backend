const express = require('express');
var Rider = require('models/rider.model')
var Rider_Package = require('models/rider_package.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();
var Path = require("./../models/riderroute.model");
var Agent = require('models/agentAddmin.model')
var AgentUser = require('models/agent_user.model')
var User = require('models/user.model')
var Package = require('models/package.modal')
var RiderRoutes = require('models/rider_routes.model')
var Sent_package = require("models/package.modal.js");
var Conversation = require('models/conversation.model')
const { MakeActivationCode } = require('../helpers/randomNo.helper');
const { SendMessage } = require('../helpers/sms.helper');
const Message = require("models/messages.model");
const { validatePasswordInput, validateLoginInput, validateRiderRegisterInput } = require('../va;lidations/user.validations');
var Sent_package = require("models/package.modal.js");
const { v4: uuidv4 } = require('uuid');
var multer = require('multer');
const Format_phone_number = require('../helpers/phone_number_formater');
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

router.post('/update-rider-avatar', [authMiddleware, authorized], upload.single('rider_avatar'), async (req, res) => {
  try {

    const rider = await Rider.findOne({ user: req.user._id })
    let userOBJ = await Rider.findOne({ user: req.user._id })
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

    let userOBJ = await Rider.findOne({ user: req.user._id })

    let user = {}
    if (req.file) {
      if (rider) {
        const body = req.body
        body.rider_id_front = url + '/uploads/Ids/' + req.file.filename
        // console.log(body)
        const Update = await Rider.findOneAndUpdate({ user: req.user._id }, { rider_id_front: req.body.rider_id_front }, { new: true, useFindAndModify: false })
        user.bike_reg_plate = rider?.bike_reg_plate
        user.rider_avatar = rider?.rider_avatar
        user.rider_licence_photo = rider?.rider_licence_photo
        user.rider_id_front = rider?.rider_id_front
        user.name = userOBJ.name
        user.phone_number = userOBJ.phone_number
        user.email = userOBJ.email
        user.role = userOBJ.role
        console.log(user)
        return res.status(200).json({ success: true, message: 'Rider Updated Successfully ', user });
      } else {
        const Update = await new Rider({ rider_avatar: req.body.rider_id_front, user: req.user._id }).save()
        user.bike_reg_plate = rider?.bike_reg_plate
        user.rider_avatar = rider?.rider_avatar
        user.rider_licence_photo = rider?.rider_licence_photo
        user.rider_id_front = rider?.rider_id_front
        user.name = userOBJ.name
        user.phone_number = userOBJ.phone_number
        user.email = userOBJ.email
        user.role = userOBJ.role
        // console.log(user)
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
    let userOBJ = await Rider.findOne({ user: req.user._id })
    let user = {}
    if (req.file) {
      if (rider) {
        const body = req.body
        body.rider_licence_photo = url + '/uploads/licence/' + req.file.filename

        const Update = await Rider.findOneAndUpdate({ user: req.user._id }, { rider_licence_photo: req.body.rider_licence_photo }, { new: true, useFindAndModify: false })
        user.bike_reg_plate = rider?.bike_reg_plate
        user.rider_avatar = rider?.rider_avatar
        user.rider_licence_photo = rider?.rider_licence_photo
        user.rider_id_front = rider?.rider_id_front
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
    let user = {}
    const body = req.body
    if (rider) {
      await Rider.findOneAndUpdate({ user: req.user._id }, body, { new: true, useFindAndModify: false })
      await User.findOneAndUpdate({ _id: rider.user?._id }, { rider: rider._id }, { new: true, useFindAndModify: false })
      user = await User.findOne({ _id: rider.user?._id }).populate("rider")
      return res.status(200).json({ success: true, message: 'Rider Updated Successfully ', user });
    }
    else {
      body.user = req.user._id
      const rider = await new Rider(body).save()
      await User.findOneAndUpdate({ _id: rider.user?._id }, { rider: rider._id }, { new: true, useFindAndModify: false })
      user = await User.findOne({ _id: rider.user?._id }).populate("rider")
      return res.status(200).json({ message: 'Saved', user });
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'operation failed ', error });
  }
});
router.put("/assign-agent-rider/:id/:agent", async (req, res) => {
  try {

    let agent = await Agent.findById(req.params.agent)

    let newriders = []
    if (agent?.rider) {
      newriders = agent.rider.push(req.params.id)
    } else {
      newriders.push(req.params.id)
    }
    await Agent.findOneAndUpdate({ _id: req.params.id }, { riders: newriders, rider: req.params.id }, { new: true, useFindAndModify: false })
    await new RiderRoutes({ agent: req.params.agent, rider: req.params.id }).save();
    await new AgentUser({
      agent: req.params.agent,
      user: req.params.id,
      role: "rider"
    }).save()

    return res.status(200).json({ message: "Sucessfully" });
  } catch (error) {
    console.log(error)
    return res
      .status(400)

      .json({ success: false, message: "operation failed ", error });
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
router.get('/agents/:id', [authMiddleware, authorized], async (req, res) => {
  try {
    console.log(req.params.id)
    const riders = await RiderRoutes.find({ rider: req.params.id }).populate('agent')
    console.log(riders)
    return res.status(200).json(riders);

  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: 'operation failed ', error });

  }

});
router.get("/riders", async (req, res) => {
  try {
    // const riders = await User.find({ role: 'rider' })
    const riders = await Rider.find().populate('user').populate('agent')
    return res.status(200).json({ message: "Fetched Sucessfully", riders });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/riders-agents", [authMiddleware, authorized], async (req, res) => {
  try {

    // const riders = await User.find({ role: 'rider' })
    const agents = await RiderRoutes.find({ rider: req.user._id }).populate('agent', 'business_name')



    return res.status(200).json(agents);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.get("/riders-agents/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    const agents = await RiderRoutes.find({ rider: req.params.id }).populate('agent', 'business_name')

    let agents_count = {}

    for (let j = 0; j < agents.length; j++) {
      let packages = await Sent_package.find({ payment_status: "paid", state: "recieved-warehouse", assignedTo: req.params.id, receieverAgentID: agents[j].agent }).sort({ createdAt: -1 }).limit(100)

      // if (packages[j].receieverAgentID === agents[j].agent) {
      //   console.log("first")
      // }

      agents_count[agents[j]?.agent?.business_name.toString()] = agents_count[agents[j]?.agent?.business_name.toString()] ? [...agents_count[agents[j]?.agent?.business_name.toString()], agents[j]._id] : [agents[j]._id]

    }

    // return res.status(200).json(agents);
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "operation failed ", error });
  }
});
router.put("/agent/package1/:id/assign-rider", async (req, res) => {
  console.log("req.body")
  try {
    await new Rider_Package({ package: req.params.id, rider: "632181644f413c3816858218" }).save()
    console.log("riders")
    await Sent_package.findOneAndUpdate({ _id: req.params.id }, { state: "assigned", assignedTo: "632181644f413c3816858218" }, { new: true, useFindAndModify: false })
    console.log('here')
    return res.status(200).json({ message: "Sucessfully" });
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
    const rider = await User.findOne({ _id: req.body.rider })

    const exists = await Conversation.findOne({
      "members": {
        $all: [
          req.body.rider, packOwner.createdBy
        ]
      }
    })

    if (exists) {

      await Conversation.findOneAndUpdate({ _id: exists._id }, { updated_at: new Date(), last_message: 'Hi  been assigned your package kindly feel free to chat' }, { new: true, useFindAndModify: false })
      await new Message({ conversationId: exists._id, sender: req.body.rider, text: `Hi  been assigned your package kindly feel free to chat` }).save()
      await Sent_package.findOneAndUpdate({ _id: req.body.package }, { state: "assigned", assignedTo: req.body.rider }, { new: true, useFindAndModify: false })
      return res.status(200).json(exists)
    } else {
      const newConversation = new Conversation({
        members: [req.body.rider, packOwner.createdBy]
      });

      const savedConversation = await newConversation.save()
      await new Message({ conversationId: savedConversation._id, sender: req.body.rider, text: `Hi  been assigned your package kindly feel free to chat` }).save()
      await Sent_package.findOneAndUpdate({ _id: req.body.package }, { state: "assigned", assignedTo: req.body.rider }, { new: true, useFindAndModify: false })
      return res.status(200).json({ message: "assigned sucessfully" });
    }


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

router.get("/get-points/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    const packages = await Path.find({ rider: req.params.id })
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