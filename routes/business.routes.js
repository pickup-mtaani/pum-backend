const express = require('express');
var Business = require('models/business.model')
var BusinessDetails = require('models/business_details.model')
const { v4: uuidv4 } = require('uuid');
var multer = require('multer');
const fs = require('fs');
var path = require('path');
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const { validateBusinesInput } = require('../va;lidations/business.validations');
const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + './../uploads/bussiness_logo');
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


router.post('/business', upload.single('logo'), [authMiddleware, authorized], async (req, res) => {
    try {
        const url = req.protocol + '://' + req.get('host');
        const Exists = await Business.findOne({ name: req.body.name, createdBy: req.user._id });
        if (Exists) {
            return res.status(400).json({ message: 'You Already added this business !!' });
        }
        const { errors, isValid } = validateBusinesInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0]
            return res.status(400).json(error);
        }
        else {
            const body = req.body
            body.createdBy = req.user._id
            body.logo = url + '/uploads/bussiness_logo/' + req.file.filename
            const newBusiness = new Business(body)
            const biz = await newBusiness.save()
            return res.status(200).json({ message: 'Saved', biz });
        }
    } catch (error) {
        console.log(error.response)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.get('/businesses', [authMiddleware, authorized], async (req, res) => {
    try {
        const Bussiness = await Business.find();

        return res.status(200).json({ message: 'Businesses Fetched Successfully !!', Bussiness });

    } catch (error) {
        console.log(error.response)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.put('/business/:id', [authMiddleware, authorized], async (req, res) => {
    try {
        const body = req.body
        const Edited = await Business.findOneAndUpdate({ _id: req.params.id }, body, { new: true, useFindAndModify: false })
        return res.status(200).json({ message: 'Edited successfully', Edited });
    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.put('/business/:id/update_logo', upload.single('logo'), [authMiddleware, authorized], async (req, res) => {
    try {
        const Biz = await Business.findById(req.params.id)
        fs.unlink(__dirname + './../uploads/bussiness_logo/' + path.basename(Biz.logo), async (err) => {
            if (err) throw err;
            if (req.file) {
                const url = req.protocol + '://' + req.get('host');
                const update = await Business.findOneAndUpdate({ _id: req.params.id }, { Logo: url + '/uploads/bussiness_logo/' + req.file.filename }, { new: true, useFindAndModify: false })
                return res.status(200).json({ message: 'Logo Updated Successfully', update });
            } else {
                return res.status(200).json({ message: 'Logo Deleted Successfully' });
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});

router.post('/business/:id/details', [authMiddleware, authorized], async (req, res) => {
    try {
        const Exists = await BusinessDetails.findOne({ business: req.params.id })
        const body = req.body
        body.createdBy = req.user._id
        body.business = req.params.id
        if (Exists) {
            const Edited = await BusinessDetails.findOneAndUpdate({ business: req.params.id }, body, { new: true, useFindAndModify: false })
            return res.status(200).json({ message: 'Saved successfully', Edited });
        } else {

            const newBusinessdetail = new BusinessDetails(body)
            const details = await newBusinessdetail.save()
            return res.status(200).json({ message: 'Saved successfully', details });
        }


    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

module.exports = router;