const express = require('express');
var AgentLocation = require('models/agents.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
var Agent = require('models/agentAddmin.model')
var Zone = require('models/zones.model')
const { v4: uuidv4 } = require('uuid');
var multer = require('multer');
const imagemin = require('imagemin');
const imageminMozJpeg = require('imagemin-mozjpeg');
const fs = require('fs');
const csv = require('csv-parser')
var path = require('path');
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
router.put('/open-close', [authMiddleware, authorized], async (req, res) => {
    try {
        let { state } = req.query
        console.log(state)
        const open = await Agent.findOneAndUpdate({ user: req.body.user_id }, {
            isOpen: state,
        }, { new: true, useFindAndModify: false })
        return res.status(200).json({ success: true, open });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.post('/agents/uploads', uploadCsv.single('csv'), async (req, res) => {
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

                    if (agent === null) {
                        let newproduct = AgentLocation({
                            name: Ar[0].toString().split(";")[1].toString().replace(/"/g, ""),
                            zone: zone,
                            lng: 0.0,
                            lat: 0.0,
                            // createdBy: req.user._id,

                        })
                        console.log(newproduct)
                        await newproduct.save();

                    }
                }

                return res.status(200).json({ message: 'Upload Successfull !' });

            })
    } catch (error) {
        console.log(error)
    }
})
router.get('/agents', async (req, res) => {
    try {

        const agents = await Agent.find().populate('user').populate('rider').populate('location_id');
        return res.status(200).json({ message: 'Agents fetched  successfully', agents });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.get('/agents-locations', async (req, res) => {
    try {
        const agents = await AgentLocation.find();
        return res.status(200).json(agents);
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

        console.log(v)
        return res.status(200).json('updated');
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.post('/update_agent', upload.array('images'), async (req, res, next) => {

    try {

        // const { errors, isValid } = hairstyleValidation(req.body);

        // if (!isValid) {

        //     return res.status(400).json(errors);

        // }


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

        const Update = await Agent.findOneAndUpdate({ user: req.body.user_id }, {
            business_name: req.body.business_name,
            working_hours: req.body.working_hours,
            location_id: req.body.location_id,
            images: reqFiles,
            mpesa_number: req.body.mpesa_number,
            loc: JSON.parse(req.body.loc),

        }, { new: true, useFindAndModify: false })
        return res.status(201).json({ success: true, message: 'Agent  Updated successfully ', Update });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'an error occured ', error });

    }




});
module.exports = router;