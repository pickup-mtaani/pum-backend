const express = require('express');
var Business = require('models/business.model')

const { v4: uuidv4 } = require('uuid');
var multer = require('multer');
const fs = require('fs');
var path = require('path');
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
var Category = require('models/business_categories.model')
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


router.post('/business', [authMiddleware, authorized], upload.single('logo'), async (req, res) => {

    try {
        const url = req.protocol + '://' + req.get('host');
        let category_id
        const Exists = await Business.findOne({ name: req.body.name, createdBy: req.user._id });
        if (Exists) {
            return res.status(400).json({ message: 'You Already added this business !!' });
        }

        const { errors, isValid } = validateBusinesInput(req.body);
        if (!isValid) {
            let error = Object.values(errors)[0]
            return res.status(400).json({ message: error });
        }

        if (req.body.other) {
            const body = req.body;
            body.createdBy = req.user._id
            body.business_catgory_name = req.body.other
            const newCategory = new Category(body)
            const New_category = await newCategory.save()
            body.category = New_category._id
        }
        category_id = req.body.category
        const body = req.body
        body.createdBy = req.user._id
        body.logo = url + '/uploads/bussiness_logo/' + req.file.filename
        const newBusiness = new Business(body)
        const biz = await newBusiness.save()
        return res.status(200).json({ message: 'Saved', biz });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.get('/busi/:id', [authMiddleware, authorized], async (req, res) => {
   
    try {
        console.log( req.params.id)
        const bussiness = await Business.find({ deleted_at: null, createdBy: req.params.id });

        return res.status(200).json({ message: 'Businesses Fetched Successfully !!', bussiness });

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
router.get('/businesses', [authMiddleware, authorized], async (req, res) => {
    try {
        const bussiness  = await Business.find({ createdBy: req.user._id }).populate('category')
        return res.status(200).json({ message: 'fetched successfully', bussiness  });
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

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});

router.post('/business/:id/details', async (req, res) => {
    try {
        let body = req.body
        const Edited = await Business.findOneAndUpdate({ _id: req.params.id }, body, { new: true, useFindAndModify: false })
        return res.status(200).json({ message: 'Saved successfully', Edited })

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

module.exports = router;