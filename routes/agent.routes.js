const express = require('express');
var AgentLocation = require('models/agents.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
var Rent_a_shelf_deliveries = require("models/rent_a_shelf_deliveries");
var Error = require("models/error.model");
var Agent = require('models/agentAddmin.model')
var Zone = require('models/zones.model')
const { v4: uuidv4 } = require('uuid');
var multer = require('multer');
const imagemin = require('imagemin');
const moment = require('moment');
const imageminMozJpeg = require('imagemin-mozjpeg');
const fs = require('fs');
var User = require('models/user.model')
const bcrypt = require('bcryptjs');
const csv = require('csv-parser')
var path = require('path');
var User = require('models/user.model')
var Agent = require('models/agentAddmin.model')
var AgentUser = require('models/agent_user.model');
const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + './../uploads/agents_gallery');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
const custom_locations = require('../helpers/agentsed.json')


var uploadCsv = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "text/csv") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .csv format allowed!'));
        }
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

const Format_phone_number = require('../helpers/phone_number_formater');
const { Makeid } = require('../helpers/randomNo.helper');
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
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.get("/rent-package/:id", async (req, res) => {
    try {
        let agent_packages
        if (req.query.searchKey) {
            var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
            agent_packages = await Rent_a_shelf_deliveries.find({ businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] }).sort({ createdAt: -1 }).limit(100)
                .populate('location')
                .populate('businessId')
                .populate('createdBy')
            return res.status(200)
                .json(agent_packages);
        } else {
            agent_packages = await Rent_a_shelf_deliveries.find({ businessId: req.params.id, }).sort({ createdAt: -1 }).limit(100)
                .populate('location')
                .populate('businessId')
                .populate('createdBy')
            return res.status(200)
                .json(agent_packages);
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.get("/rent-package/:id/:state", async (req, res) => {
    try {
        let { agent } = req.query
        // console.log("first", req.query)
        let agent_packages
        if (req.query.searchKey) {
            var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
            agent_packages = await Rent_a_shelf_deliveries.find({ location: agent, state: req.params.state, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] }).sort({ createdAt: -1 }).limit(100)
                .populate('location')
                .populate('businessId')
                .populate('createdBy')
                .populate('rejectedId')
            return res.status(200)
                .json(agent_packages);
        } else {
            agent_packages = await Rent_a_shelf_deliveries.find({ location: agent, state: req.params.state, businessId: req.params.id, }).sort({ createdAt: -1 }).limit(100)
                .populate('location', "business_name")
                .populate('businessId', 'name')
                .populate('createdBy')
                .populate('rejectedId', 'reject_reason')

            return res.status(200)
                .json(agent_packages);
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.get("/rent-package-expired/:id", async (req, res) => {

    try {
        let agent_packages
        if (req.query.searchKey) {
            var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
            agent_packages = await Rent_a_shelf_deliveries.find({ updatedAt: { $lte: moment().subtract(14, 'days').toDate() }, state: { $ne: "collected" }, businessId: req.params.id, $or: [{ packageName: searchKey }, { receipt_no: searchKey }, { customerPhoneNumber: searchKey }] }).sort({ createdAt: -1 }).limit(100)
                .populate('location')
                .populate('businessId')
                .populate('createdBy')
                .populate("rejectedId")
            return res.status(200)
                .json(agent_packages);
        } else {
            agent_packages = await Rent_a_shelf_deliveries.find({ updatedAt: { $lte: moment().subtract(14, 'days').toDate() }, state: { $ne: "collected" }, businessId: req.params.id, }).sort({ createdAt: -1 }).limit(100)
                .populate('location')
                .populate('businessId')
                .populate('createdBy')
                .populate("rejectedId")
            return res.status(200)
                .json(agent_packages);
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ success: false, message: "operation failed ", error });
    }
});
router.get('/rent-a-shelf-agents', [authMiddleware, authorized], async (req, res) => {
    try {

        const agents = await Agent.find({ isSuperAgent: true })

        return res.status(200).json(agents);
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.get('/rent-a-shelf-agents', [authMiddleware, authorized], async (req, res) => {
    try {

        const agents = await Agent.find({ isSuperAgent: true })

        return res.status(200).json(agents);
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.get('/shelf-locations', async (req, res) => {
    try {

        const agents = await Agent.find({ hasShelf: true })

        return res.status(200).json(agents);
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.put('/open-close', [authMiddleware, authorized], async (req, res) => {
    try {
        let { state } = req.query

        const open = await Agent.findOneAndUpdate({ user: req.body.user_id }, {
            isOpen: state,
        }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, open });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.post('/agents-locations/uploads', uploadCsv.single('csv'), async (req, res) => {
    try {

        let zone1 = await Zone.findOne({ name: "Zone A" })
        let zone2 = await Zone.findOne({ name: "Zone B" })
        let zone3 = await Zone.findOne({ name: "Zone C" })

        let Agents = [];
        fs.createReadStream(`${req.file.path}`)
            .pipe(csv())
            .on('data', async (row) => {
                Agents.push(row)
            })
            .on('end', async () => {
                var i;
                for (i = 0; i < Agents.length; i++) {
                    let Ar = Object.values(Agents[i])
                    let zn = Ar[0].toString().split(";")[3].slice(1)
                    let zone

                    if (zn === 'ZONE-3') {
                        zone = zone3._id
                    } else if (zn === 'ZONE-2') {
                        zone = zone2._id
                    } else {
                        zone = zone1._id
                    }

                    const agent = await AgentLocation.findOne({ name: Ar[0].toString().split(";")[1].code })
                    const myString = Ar[0].toString().split(";")[0]
                    if (agent === null) {
                        let newproduct = AgentLocation({
                            name: Ar[0]?.toString().split(";")[1].toString().replace(/"/g, ""),
                            zone: zone,
                            lng: 0.0,
                            lat: 0.0,
                            id: myString.slice(0, myString.length - 1)
                            // createdBy: req.user._id,

                        })

                        await newproduct.save();

                    }
                }

                return res.status(200).json({ message: 'Upload Successfull !' });

            })
    } catch (error) {
        console.log(error)
    }
})
router.post('/agents/uploads', [authMiddleware, authorized], async (req, res) => {
    try {
        let obj =
        {
            business_name: '',
            opening_hours: '',
            location_id: "",
            working_hours: "",
            closing_hours: "",
            isSuperAgent: false,
            map_path: '',
            user: ''
        }
        const locations = await AgentLocation.find();
        let i
        let j

        for (i = 0; i < locations.length; i++) {
            for (j = 0; j < Object.values(custom_locations).length; j++) {
                obj.business_name = Object.values(custom_locations)[j].agent_location
                obj.opening_hours = Object.values(custom_locations)[j].opening_time
                obj.closing_hours = Object.values(custom_locations)[j].closing_time
                obj.agent_description = Object.values(custom_locations)[j].agent_description
                obj.prefix = Object.values(custom_locations)[j].prefix
                if (parseInt(locations[i].id) === Object.values(custom_locations)[j].location) {
                    obj.location_id = locations[i]._id
                    obj.zone = locations[i].zone
                    if (Object.values(custom_locations)[j].CONTACTS !== "") {
                        if (!await User.findOne({ name: `${Object.values(custom_locations)[j].agent_location} Agent` })) {

                            let phone = await Format_phone_number(`0${Object.values(custom_locations)[j].CONTACTS}`)
                            let saved = await new User({

                                name: `${Object.values(custom_locations)[j].agent_location} Agent`,
                                phone_number: phone,
                                activated: false,
                                role: 'agent',

                                hashPassword: bcrypt.hashSync("passwads", 10),
                                createdBy: req.user._id,
                                email: `agent@${Object.values(custom_locations)[j].agent_location.replace(/\s/g, '')}.com`

                            }).save()
                            obj.user = saved._id
                            let agent = await new Agent(obj).save()
                            await new AgentUser({
                                agent: agent._id,
                                user: saved._id,
                                role: "agent"
                            }).save()
                        }
                        else {
                            let agent = await new Agent(obj).save()
                        }

                    }


                }



            }

        }


        return res.json([])
    } catch (error) {
        console.log(error)
    }
})
// router.post('/agents/useragents', async (req, res) => {
//     try {

//         let AgentsArr = await Agent.find()

//         for (i = 0; i < AgentsArr.length; i++) {
//             console.log("first", AgentsArr[i])
//             await new AgentUser({
//                 agent: AgentsArr[i]._id,
//                 user: AgentsArr[i].user,
//                 role: "agent"
//             }).save()
//         }

//         return res.json(AgentsArr)
//     } catch (error) {
//         console.log(error)
//     }
// })
router.post('/agents-details/bulk-revoke-super-agent', async (req, res) => {
    try {

        let AgentsArr = await Agent.find()

        for (i = 0; i < AgentsArr.length; i++) {
            if (AgentsArr[i].business_name === "Pickup Mtaani Star Mall" || AgentsArr[i].business_name === "Philadelphia house ") {
                await Agent.findOneAndUpdate({ _id: AgentsArr[i] }, {
                    isSuperAgent: true, hasShelf: true
                }, { new: true, useFindAndModify: false })

            }
            else {
                await Agent.findOneAndUpdate({ _id: AgentsArr[i] }, {
                    isSuperAgent: true, hasShelf: true
                }, { new: true, useFindAndModify: false })
            }


        }

        return res.json(AgentsArr)
    } catch (error) {
        console.log(error)
    }
})
router.get('/agents', async (req, res) => {
    try {
        if (req.query.searchKey) {
            var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
            if (req.query.location) {
                const agents = await Agent.find({ location_id: req.query.location, business_name: searchKey }).populate('user').populate('rider').populate('location_id').sort({ business_name: 1 });
                return res.status(200).json({ message: 'Agents fetched  successfully', agents });
            }
            else {
                const agents = await Agent.find({ business_name: searchKey }).populate('user').populate('rider').populate('location_id').sort({ business_name: 1 });
                return res.status(200).json({ message: 'Agents fetched  successfully', agents });
            }
        } else {
            if (req.query.location) {
                const agents = await Agent.find({ location_id: req.query.location }).populate('user').populate('rider').populate('location_id').sort({ business_name: 1 });
                return res.status(200).json({ message: 'Agents fetched  successfully', agents });
            }
            else {
                const agents = await Agent.find().populate('user').populate('rider').populate('location_id').sort({ business_name: 1 });
                return res.status(200).json({ message: 'Agents fetched  successfully', agents });
            }
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.put('/agents/:id', async (req, res) => {
    try {
        let agent = await Agent.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
        await User.findOneAndUpdate({ _id: agent.user }, req.body, { new: true, useFindAndModify: false })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.get('/agents-grouped', async (req, res) => {
    try {
        let t = await Agent.aggregate(
            [
                {

                    $group: {
                        _id: '$location_id',
                        count: { $sum: 1 },
                        data: {
                            $addToSet: {
                                business_name: "$business_name",
                                _id: "$_id",
                                agent_description: "$agent_description",
                                opening_hours: "$opening_hours",
                                closing_hours: "$closing_hours",
                                prefix: "$prefix",
                                isOpen: "$isOpen",
                                isSuperAgent: "$isSuperAgent",
                                images: "$images",
                                hasShelf: "$hasShelf",
                                working_hours: "$working_hours",
                                location_id: "$location_id",

                            }
                            //     $addToSet: "$agent_description",

                            // }
                            // _id: 1,
                            // totalSaleAmount: { $sum: { $multiply: ["$price", "$quantity"] } },
                            // averageQuantity: { $avg: "$quantity" },
                            // count: { $sum: 1 }
                        }
                    }

                },
                {
                    "$lookup": {
                        "from": "Location_id",
                        "localField": "from",
                        "foreignField": "_id",
                        "as": "from"
                    }
                },
                {
                    "$set": {
                        "product_id": "$_id",
                        "productHFhfhff": "$working_hours",

                    },

                },

                // // Third Stage
                // {
                //     $sort: { totalSaleAmount: -1 }
                // }
            ]
        )
        return res.status(200).json(t);

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.get('/agents-locations', async (req, res) => {
    try {
        let zoneA = await Zone.findOne({ name: "Zone A" })
        let zoneB = await Zone.findOne({ name: "Zone B" })
        let zones
        if (req.query.searchKey) {
            var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
            zones = await AgentLocation.find({ $or: [{ zone: zoneA._id }, { zone: zoneB._id }], name: searchKey }).sort({ name: 1 });
            return res.status(200).json(zones);
        } else {
            zones = await AgentLocation.find({ $or: [{ zone: zoneA._id }, { zone: zoneB._id }] }).sort({ name: 1 });


            return res.status(200).json(zones);
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.get('/agents-zones-abc', async (req, res) => {
    try {
        let zones
        if (req.query.searchKey) {
            var searchKey = new RegExp(`${req.query.searchKey}`, 'i')
            zones = await AgentLocation.find({ name: searchKey }).sort({ name: 1 });
            return res.status(200).json(zones);
        } else {
            zones = await AgentLocation.find().sort({ name: 1 });


            // const agents = await AgentLocation.find({ $or: [{ zone: zoneA._id }, { zone: zoneB._id }] }).sort({ name: 1 });
            // console.log("Agents", agents)
            return res.status(200).json(zones);
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.put('/assign-zone/:id', async (req, res) => {
    try {
        let v = await Agent.findOneAndUpdate({ _id: req.params.id }, {
            zone: req.query.zone,
            route: req.query.route

        }, { new: true, useFindAndModify: false })


        return res.status(200).json('updated');
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.put('/activate_agent/:id', async (req, res) => {
    try {
        let agent = await Agent.findOne({ _id: req.params.id })
        await User.findOneAndUpdate({ _id: agent.user }, {
            activated: true
        }, { new: true, useFindAndModify: false })
        return res.status(200).json('activated');
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.put('/activate-deactivate/:id', async (req, res) => {
    try {
        let use = await User.findOne({ _id: req.params.id })
        await User.findOneAndUpdate({ _id: req.params.id }, {
            activated: !use.activated
        }, { new: true, useFindAndModify: false })
        return res.status(200).json('activated');
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.put('/update_agent/:id', upload.array('images'), async (req, res, next) => {
    try {

        req.body.prefix = `PMT-${req.body.prefix.toUpperCase()}-`
        if (req?.files?.length > 0) {
            const reqFiles = [];
            const url = req.protocol + '://' + req.get('host')
            for (var i = 0; i < req.files.length; i++) {
                reqFiles.push(url + '/uploads/agents_gallery/' + req.files[i].filename);

                await imagemin(["uploads/agents_gallery/" + req.files[i].filename], {
                    destination: "uploads/agents_gallery",
                    plugins: [
                        imageminMozJpeg({ quality: 30 })
                    ]
                })
            }
            req.body.images = reqFiles
            req.body.loc = JSON.parse(req.body.loc)
            const Update = await Agent.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
            return res.status(201).json({ success: true, message: 'Agent  Updated successfully ', Update });

        }
        else {
            // delete req.body.images
            const { images, ...other_details } = req.body
            req.body.loc = JSON.parse(other_details.loc)
            const Update = await Agent.findOneAndUpdate({ _id: req.params.id }, other_details, { new: true, useFindAndModify: false })
            return res.status(201).json({ success: true, message: 'Agent  Updated successfully ', Update });

        }

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'an error occured ', error });

    }

});
router.put('/update-agent/:id', async (req, res, next) => {
    try {

        req.body.loc = JSON.parse(req.body.loc)
        req.body.working_hours = JSON.parse(req.body.working_hours)
        const Update = await Agent.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
        console.log("BODY", Update)
        return res.status(201).json({ success: true, message: 'Agent  Updated successfully ', Update });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'an error occured ', error });

    }

});
router.delete('/delete-agent/:id', async (req, res, next) => {
    try {
        let agent = await Agent.findById(req.params.id)
        await User.findOneAndDelete({ _id: agent.user })
        await Agent.findOneAndDelete({ _id: req.params.id })

        return res.status(201).json({ success: true, message: 'Agent  Updated successfully ' });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'an error occured ', error });

    }

});


// ERr
router.post('/error', [authMiddleware, authorized], async (req, res) => {

    try {

        const body = req.body
        body.user_id = req.user._id
        new Error(body).save()

        return res.status(200).json({ message: 'error Added successfully' });

    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.get('/error', async (req, res) => {

    try {
        const body = await Error.find().populate('user_id')
        return res.status(200).json(body);

    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});


module.exports = router;