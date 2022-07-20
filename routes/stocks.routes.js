const express = require('express');
var Stock = require('models/stocks.model')
var Logs = require('models/logs.model')
var User = require('models/user.model')
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();



router.post('/stock', [authMiddleware, authorized], async (req, res) => {
    try {
        const Exists = await Stock.findOne({ business: req.body.business, product: req.body.product }).populate(['business', 'createdBy', 'product']);
        const user = await User.findById(req.user._id)

        if (Exists) {
            const newqty = parseInt(req.body.qty) + parseInt(Exists.qty)
            const Update = await Stock.findOneAndUpdate({ _id: Exists._id }, { qty: newqty, restock_at: Date.now() }, { new: true, useFindAndModify: false })
            const newLog = new Logs({
                type: 'Restocking',
                initiator: user._id,
                activity: `${user.username} Added a stock of ${req.body.qty} to ${Exists.qty} new qty for ${Exists.product.product_name} at ${Exists.business.name} is ${newqty}`
            })
            await newLog.save()
            return res.status(200).json({ message: 'Restocked successfully !!', Update });
        }
        const body = req.body
        body.createdBy = req.user._id
        const newStock = new Stock(body)
        const saved = await newStock.save()
        const stocked = await Stock.findOne({ _id: saved._id }).populate(['business', 'createdBy', 'product']);
        const newLog = new Logs({
            type: 'Initial stock',
            initiator: user._id,
            activity: `${user.username} Added The initial stock of ${stocked.qty} to ${stocked.product.product_name}  to ${stocked.business.name}`
        })
        await newLog.save()
        return res.status(200).json({ message: 'Stock Added successfully', saved: saved });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});



module.exports = router;