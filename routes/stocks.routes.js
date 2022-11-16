const express = require('express');
var Stock = require('models/stocks.model')
var Logs = require('models/logs.model')
var User = require('models/user.model')
var Product = require('models/products.model')
var Bussiness = require('models/business.model')
var Reject = require('models/reject_stocks.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const { SendMessage } = require('../helpers/sms.helper');
const Format_phone_number = require('../helpers/phone_number_formater');
const router = express.Router();



router.post('/stock', [authMiddleware, authorized], async (req, res) => {
    try {

        const prod = await Product.findOne({ _id: req.body.product, business: req.body.business })

        // if (Exists) {
        //     const newqty = parseInt(req.body.qty) + parseInt(Exists.qty)
        //     const Update = await Stock.findOneAndUpdate({ _id: Exists._id }, { qty: newqty, restock_at: Date.now() }, { new: true, useFindAndModify: false })
        //     const newLog = new Logs({
        //         type: 'Restocking',
        //         initiator: user._id,
        //         activity: `${user.username} Added a stock of ${req.body.qty} to ${Exists.qty} new qty for ${Exists.product.product_name} at ${Exists.business.name} is ${newqty}`
        //     })
        //     await newLog.save()
        //     return res.status(200).json({ message: 'Restocked successfully !!', Update });
        // }

        const body = req.body
        body.current_stock = prod.qty
        body.createdBy = req.user._id
        const newStock = new Stock(body)
        const saved = await newStock.save()
        const Update = await Product.findOneAndUpdate({ business: body.business, _id: body.product }, { pending_stock_confirmed: false, pending_stock: body.qty }, { new: true, useFindAndModify: false })
        //    
        // const stocked = await Stock.findOne({ _id: saved._id }).populate(['business', 'createdBy', 'product']);
        // const newLog = new Logs({
        //     type: 'Initial stock',
        //     initiator: user._id,
        //     activity: `${user.username} Added The initial stock of ${stocked.qty} to ${stocked.product.product_name}  to ${stocked.business.name}`
        // })
        // await newLog.save()
        return res.status(200).json({ message: 'Stock Added successfully', saved: saved });

    } catch (error) {
        console.log("STOCKING ERROR: " + error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});

router.post('/approve-stock/:bussiness_id/:product_id', [authMiddleware, authorized], async (req, res) => {
    try {
        const prod = await Product.findOne({ business: req.params.bussiness_id, _id: req.params.product_id })
        console.log(prod)
        const Update = await Product.findOneAndUpdate({ business: req.params.bussiness_id, _id: req.params.product_id }, { pending_stock_confirmed: true, pending_stock: 0, qty: parseInt(prod.qty + prod.pending_stock) }, { new: true, useFindAndModify: false })

        return res.status(200).json({ message: 'Stock approved successfully' });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});
router.post('/reject-stock/:bussiness_id/:product_id', [authMiddleware, authorized], async (req, res) => {
    try {
        const business = await Bussiness.findById(req.params.bussiness_id).populate('createdBy')

        const prod = await Product.findById(req.params.product_id)
        const body = req.body
        body.business = req.params.bussiness_id
        body.product = req.params.product_id
        body.rejectedBy = req.user._id

        const textbody = {
            address: Format_phone_number(`${business.createdBy.phone_number}`), Body: `Hello  ${business.name}, Kindly note that ${prod.product_name} has been rejected because ${body?.reason}
          ` }

        await Product.findOneAndUpdate({ business: req.params.bussiness_id, _id: req.params.product_id }, { pending_stock_confirmed: true }, { new: true, useFindAndModify: false })

        await SendMessage(textbody)
        await new Reject(body).save()
        return res.status(200).json({ message: 'Stock approved successfully', });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});



module.exports = router;