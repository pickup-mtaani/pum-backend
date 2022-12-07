const express = require('express');
var Business = require('models/business.model')
var BUssinessDeatails = require('models/business_details.model')
const { v4: uuidv4 } = require('uuid');
var moment = require('moment');
var multer = require('multer');
const fs = require('fs');
var path = require('path');
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
var Category = require('models/business_categories.model')
const { validateBusinesInput } = require('../va;lidations/business.validations');
const { now } = require('moment');
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
            body.createdBy = req.body.user_id
            body.name = req.body.other
            const newCategory = new Category(body)
            const New_category = await newCategory.save()
            body.category = New_category._id
        }
        if (req.file) {
            category_id = req.body.category
            const body = req.body
            body.createdBy = req.body.user_id
            body.logo = url + '/uploads/bussiness_logo/' + req.file.filename
            const newBusiness = new Business(body)
            const biz = await newBusiness.save()
            return res.status(200).json({ message: 'Saved', biz });
        }

        category_id = req.body.category
        const body = req.body
        body.createdBy = req.body.user_id
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
router.put('/activate-shelf/:id', [authMiddleware, authorized], async (req, res) => {
    try {
        const body = req.body
        const Edited = await Business.findOneAndUpdate({ _id: req.params.id }, { has_shelf: true }, { new: true, useFindAndModify: false })
        return res.status(200).json({ message: 'Edited successfully', Edited });
    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.put('/request-shelf/:id', [authMiddleware, authorized], async (req, res) => {
    try {
        const body = req.body

        if (body.choice) {
            const Edited = await Business.findOneAndUpdate({ _id: req.params.id }, { shelf_location: body.shelf_location, has_shelf: true }, { new: true, useFindAndModify: false })
            return res.status(200).json({ message: 'Edited successfully', Edited });
        } else {
            return res.status(200).json({ message: 'Edited successfully' });
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
// fetch businesses  that have rent shelf unde agent 
router.get('/rent-a-shelf-agents/:id/business', [authMiddleware, authorized], async (req, res) => {
    try {

        const businessess = await Business.find({ agent: req.params.id })
        return res.status(200).json(agents);
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.put('/business-deactivate/:id', [authMiddleware, authorized], async (req, res) => {
    try {

        const data = await Business.findOneAndUpdate({ _id: req.params.id }, { deleted_at: moment() }, { new: true, useFindAndModify: false })

        return res.status(200).json({ message: 'Edited successfully', data });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.get('/businesses', [authMiddleware, authorized], async (req, res) => {
    try {
        const bussiness = await Business.find({ createdBy: req.user._id, deleted_at: null }).populate(['category', "agent"])
            .populate({
                path: 'details',
                populate: {
                    path: 'agent',

                }
            }).populate("shelf_location", 'business_name'
            )

        return res.status(200).json({ message: 'fetched successfully', bussiness });
    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.get('/rent-shelf-business/:id', async (req, res) => {
    try {
        const bussiness = await Business.find({ shelf_location: req.params.id, deleted_at: null }).populate(['category', "agent"])
            .populate({
                path: 'details',
                populate: {
                    path: 'agent',
                }
            })

        return res.status(200).json({ message: 'fetched successfully', bussiness });
    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.get('/all-businesses', [authMiddleware, authorized], async (req, res) => {
    try {
        const bussiness = await Business.find().populate(['category', "agent"])
            .populate({
                path: 'details',
                populate: {
                    path: 'agent',

                }
            })

        return res.status(200).json({ message: 'fetched successfully', bussiness });
    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});



router.put('/business/:id/update_logo', upload.single('logo'), [authMiddleware, authorized], async (req, res) => {
    try {
        const Biz = await Business.findById(req.params.id)
        // console.log(Biz);
        // if (Biz.logo) {
        //     fs.unlink(__dirname + './../uploads/bussiness_logo/' + path.basename(Biz.logo), async (err) => {
        //         if (err) throw err;
        //         if (req.file) {
        //             const url = req.protocol + '://' + req.get('host');
        //             const update = await Business.findOneAndUpdate({ _id: req.params.id }, { logo: url + '/uploads/bussiness_logo/' + req.file.filename }, { new: true, useFindAndModify: false })
        //             return res.status(200).json({ message: 'Logo Updated Successfully', update });
        //         } else {
        //             return res.status(200).json({ message: 'Logo Deleted Successfully' });
        //         }
        //     });
        // }else{
        if (req.file) {
            const url = req.protocol + '://' + req.get('host');
            const update = await Business.findOneAndUpdate({ _id: req.params.id }, { logo: url + '/uploads/bussiness_logo/' + req.file.filename }, { new: true, useFindAndModify: false })
            return res.status(200).json({ message: 'Logo Updated Successfully', update });
        } else {
            const url = req.protocol + '://' + req.get('host');
            const update = await Business.findOneAndUpdate({ _id: req.params.id }, { logo: null }, { new: true, useFindAndModify: false })
            return res.status(200).json({ message: 'Logo deleteed Successfully', update });
        }
        // }


    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});

router.post('/business/:id/details', async (req, res) => {

    try {

        let body = req.body

        const exists = await BUssinessDeatails.findOne({ business: req.params.id })
        if (exists) {
            const Edited = await BUssinessDeatails.findOneAndUpdate({ business: req.params.id }, body, { new: true, useFindAndModify: false })
            return res.status(200).json({ message: 'Saved successfully', Edited })
        } else {
            const newDetails = new BUssinessDeatails(body)
            const savedDetails = await newDetails.save()
            await Business.findOneAndUpdate({ _id: req.params.id }, { details: savedDetails._id }, { new: true, useFindAndModify: false })

            return res.status(200).json({ message: 'Saved successfully', newDetails })

        }



    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

module.exports = router;