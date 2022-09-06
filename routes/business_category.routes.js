const express = require('express');
var Category = require('models/business_categories.model')
var Product_subcategory = require('models/sub_categories.model');
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();





router.post('/busines-category', [authMiddleware, authorized], async (req, res) => {
    try {

        const categoryExists = await Category.findOne({ name: req.body.name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category Exists !!' });
        }
        else {
            const body = req.body;
            body.createdBy = req.user._id
            const newCategory = new Category(body)
            const category = await newCategory.save()
            return res.status(200).json({ message: 'Saved', category });
        }

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });

    }

});


router.get('/busines-categories', async (req, res) => {
    try {
        const Categories = await Category.find({ deleted_at: null });
        return res.status(200).json({ success: true, message: 'Categories fetched successfull', Categories });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.post('/product-category', [authMiddleware, authorized], async (req, res) => {
    try {
        const Exists = await Product_subcategory.findOne({ name: req.body.name });
        if (Exists) {
            return res.status(400).json({ success: false, message: 'Sub Product category already exists' });
        } else {
            const body = req.body;
            body.createdBy = req.user._id
            const newCategory = new Product_subcategory(body)
            const category = await newCategory.save()
            return res.status(200).json({ message: 'Saved', category });
        }

    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});

router.get('/product-categories', async (req, res) => {
    try {
        const Categories = await Product_subcategory.find({ deleted_at: null, other: false });
        return res.status(200).json({ success: true, message: 'Categories fetched successfull', Categories });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }

});
module.exports = router;