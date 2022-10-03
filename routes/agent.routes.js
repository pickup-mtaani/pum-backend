const express = require('express');
// var Agent = require('models/agents.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
var Agent = require('models/agentAddmin.model')
var User = require('models/user.model')
const { v4: uuidv4 } = require('uuid');
var multer = require('multer');
const imagemin = require('imagemin');
const imageminMozJpeg = require('imagemin-mozjpeg');
const fs = require('fs');
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
router.get('/agents', async (req, res) => {
    try {

        const agents = await Agent.find().populate('zone').populate('user');
        return res.status(200).json({ message: 'Agents fetched  successfully', agents });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});

router.put('/assign-zone/:id', async (req, res) => {
    try {
        await Agent.findOneAndUpdate({ _id: req.params.id }, {
            zone: req.query.zone

        }, { new: true, useFindAndModify: false })
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