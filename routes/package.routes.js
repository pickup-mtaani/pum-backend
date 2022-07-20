const express = require('express');
var Package = require('models/package.modal.js')
var Thrifter = require('models/thrifter.model.js')
var Location = require('models/thrifter_location.model.js')
var User = require('models/user.model.js')
var Reject = require('models/Rejected_parcels.model')
var Reciever = require('models/reciever.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const { Makeid } = require('../helpers/randomNo.helper');
const { SendMessage } = require('../helpers/sms.helper');
const moment = require('moment');
const router = express.Router();



router.post('/package', [authMiddleware, authorized], async (req, res) => {
    try {
        const Thrift = await Thrifter.findOne({ user_id: req.user._id })
        // user_id
        res
        const UserObj = await User.findById(Thrift.user_id)

        const body = req.body;
        body.thrifter_id = Thrift._id
        body.receipt_no = `PM-${Makeid(5)}`
        const newPackage = new Package(req.body)
        await newPackage.save()
        const Custodian = await Location.findOne({ _id: body.current_custodian }).populate('user_id')
        const textObj = { address: `${Custodian.user_id.phone_number}`, Body: `Hi ${UserObj.username}\n ${Thrift.name} Will be delivering a package in  a ${body.pack_color} package ` }

        const recObj = { address: `${body.recipient_phone}`, Body: `Hi ${newPackage.recipient_name}\n ${Thrift.name} Has dispatched a packege to  ${Custodian.agent_location}\nkindly wait for a confirmation  to pick it later today ` }
        // await SendMessage(textObj)
        // await SendMessage(recObj)
        return res.status(200).json({ message: 'Package successfully Saved', newPackage });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.post('/package/:id/recieve', [authMiddleware, authorized], async (req, res) => {
    try {

        const Pack = await Package.findById(req.params.id).populate(['thrifter_id', 'current_custodian'])
        const RecievedPack = await Package.findOneAndUpdate({ _id: req.params.id }, { recieved: true, receiving_agent: req.user._id, recieved_at: Date.now() }, { new: true, useFindAndModify: false })
        const smsBody = { address: `${Pack.recipient_phone}`, Body: `Hello ${Pack.recipient_name}, Kindly Collect your Parcel from ${Pack.thrifter_id.name} at ${Pack.current_custodian.agent_location} before the close of Day ${moment(new Date().setDate(new Date().getDate() + 3)).format('ddd MMM YY')}` }
        // const body = req.body

        // body.package = req.params.id
        // await new Reciever(body).save()
        await SendMessage(smsBody)
        return res.status(200).json({ message: 'Package successfully Recieved', RecievedPack });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
router.post('/package/:id/collect', [authMiddleware, authorized], async (req, res) => {
    try {

        const Pack = await Package.findById(req.params.id).populate(['thrifter_id', 'current_custodian'])
        const RecievedPack = await Package.findOneAndUpdate({ _id: req.params.id }, { collected: true, receiving_agent: req.user._id, collected_at: Date.now() }, { new: true, useFindAndModify: false })

        const body = req.body
        body.package = req.params.id
        await new Reciever(body).save()
        const smsBody = {
            address: `{Pack.recipient_phone}`, Body: `Hello ${Pack.recipient_name}, Your Parcel from ${Pack.thrifter_id.name} has been collected  by ${body.reciver_name}of ID_NO ${body.reciver_id_no}`
        }

        await SendMessage(smsBody)
        return res.status(200).json({ message: 'Package successfully Recieved', RecievedPack });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.post('/package/:id/reject', [authMiddleware, authorized], async (req, res) => {
    try {


        const Pack = await Package.findById(req.params.id).populate('thrifter_id')
        const Thrifter = await User.findById(Pack.thrifter_id.user_id)

        const newReject = new Reject(req.body).save()
        const smsBody = { address: `${Thrifter.phone_number}`, Body: `Hello ${Pack.thrifter_id.name},Parcel from ${Pack.receipt_no} has been rejected due ${req.body.reject_reason} kindly edit the details to allow further processing` }
        await SendMessage(smsBody)
        const RecievedPack = await Package.findOneAndUpdate({ _id: req.params.id }, { rejected: true, rejecting_agent: req.user._id, rejected_at: Date.now(), rejected_reasons: newReject._id }, { new: true, useFindAndModify: false })
        return res.status(200).json({ message: 'Package successfully rejectesd', RecievedPack });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
// router.post('/package/:id/reject', [authMiddleware, authorized], async (req, res) => {
//     try {

//         const Pack = Package.findById(req.params.id)
//         const newReject = new Reject(req.body).save()
//         const RecievedPack = await Package.findOneAndUpdate({ _id: req.params.id }, { rejected: true, rejecting_agent: req.user._id, rejected_at: Date.now(), rejected_reasons: newReject._id }, { new: true, useFindAndModify: false })
//         return res.status(200).json({ message: 'Package Rejected  and thriter notified', RecievedPack });

//     } catch (error) {
//         
//         return res.status(400).json({ success: false, message: 'operation failed ', error });
//     }

// });

router.get('/packages', async (req, res) => {
    try {
        const Packages = await Package.find().populate(['thrifter_id', 'current_custodian'])

        // await User.findOneAndUpdate({ _id: req.user._id }, { role: RoleOb._id }, { new: true, useFindAndModify: false })
        return res.status(200).json({ message: 'Fetched Sucessfully', Packages });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});





module.exports = router;