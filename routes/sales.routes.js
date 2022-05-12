const express = require('express');
var Sale = require('models/sales.model')
var Stock = require('models/stocks.model')
var User = require('models/user.model')
var Location = require('models/thrifter_location.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();
const { SendMessage } = require('../helpers/sms.helper');
router.post('/sale', [authMiddleware, authorized], async (req, res) => {
    try {
        Exists = await Stock.findOne({ business: req.body.business, product: req.body.product }).populate(['business', 'createdBy', 'product']);
        const newqty = parseInt(Exists.qty) - parseInt(req.body.qty)
        const Agent = await Location.findById(Exists.business.shelf_location).populate("user_id")
        if (newqty < 0) {
            return res.status(400).json({ success: false, message: 'Current stock is not enough kindly Restock ' });
        } else {
            const body = req.body
            body.createdBy = req.user._id
            const newSale = new Sale(body)
            const saved = await newSale.save()
            await Stock.findOneAndUpdate({ _id: Exists._id }, { qty: newqty }, { new: true, useFindAndModify: false })

            const Business = await User.findById(Exists.business.createdBy)
            const Sold = await Sale.findOne({ _id: saved._id }).populate(['business', 'createdBy', 'product']);
            const Agency = await User.findById(Agent.user_id._id)


            if (Exists.business.createdBy !== req.user._id) {
                const TextObj = { address: `+254${Business.phone_number}`, Body: `Hi ${Business.username}\n${saved.qty} Pc(s) of  ${Sold.product.product_name}  has been Sold out and your new stock is ${newqty} ` }
                await SendMessage(TextObj)
                return res.status(200).json({ message: 'Sale Added successfully', saved: saved });
            } else {
                const TextObj = { address: `+254${Agency.phone_number}`, Body: `Hi ${Agency.username}\n${saved.qty} Pc(s) of  ${Sold.product.product_name}  has been Sold out by ${Business.username} and the new stock is ${newqty} ` }
                await SendMessage(TextObj)
                return res.status(200).json({ message: 'Sale Added successfully', saved: saved });
            }

        }

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});



module.exports = router;