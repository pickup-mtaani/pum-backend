const express = require('express');
var Product = require('models/products.model')
var Stock = require('models/stocks.model')
const imagemin = require('imagemin');
const imageminMozJpeg = require('imagemin-mozjpeg')
var Category = require('models/business_categories.model')
const { v4: uuidv4 } = require('uuid');
var multer = require('multer');
var path = require('path');
const fs = require('fs');
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + './../uploads/products');
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


router.post('/product', upload.array('images'), [authMiddleware, authorized], async (req, res) => {
    try {

        const Exists = await Product.findOne({ product_name: req.body.product_name, createdBy: req.user._id });
        if (Exists) {
            return res.status(400).json({ message: 'You Already added this Product !!' });
        }
        else {
            const reqFiles = [];
            const url = req.protocol + '://' + req.get('host')
            for (var i = 0; i < req.files.length; i++) {
                reqFiles.push(url + '/uploads/products/' + req.files[i].filename);
                await imagemin(["uploads/products/" + req.files[i].filename], {
                    destination: "uploads/products",
                    plugins: [
                        imageminMozJpeg({ quality: 30 })
                    ]
                })

            }
            if (req.body.other) {
                const body = req.body;
                body.createdBy = req.user._id
                body.name = req.body.other
                const newCategory = new Category(body)
                const category = await newCategory.save()
                body.category = category._id
            }
            const body = req.body
            body.createdBy = req.user._id
            body.images = reqFiles
            const newProduct = new Product(body)
            const product_created = await newProduct.save()
            body.product = product_created._id
            let newStock = new Stock(body)
            await newStock.save()
            return res.status(200).json({ message: 'Saved', product_created });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.get('/products', upload.array('images'), [authMiddleware, authorized], async (req, res) => {
    try {
        const { page, limit } = req.query
        const PAGE_SIZE = limit;
        const skip = (page - 1) * PAGE_SIZE;
        const products = await Product.find({ deleted_at: null, createdBy: req.user._id }).populate('category').skip(skip)
            .limit(PAGE_SIZE);
        // let stocks = await Stock.find({ createdBy: req.user._id }).populate('product');

        return res.status(200).json({ message: 'Successfull pulled ', products })

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
// router.get('/products/:id', [authMiddleware, authorized], async (req, res) => {
//     try {
//         const { page, limit } = req.query
//         const PAGE_SIZE = limit;
//         const skip = (page - 1) * PAGE_SIZE;
//         const products = await Product.find({ deleted_at: null, createdBy: req.params.id }).populate('category').skip(skip)
//             .limit(PAGE_SIZE);

//         return res.status(200).json({ message: 'Successfull pulled ', products });

//     } catch (error) {

//         return res.status(400).json({ success: false, message: 'operation failed ', error });
//     }
// });
router.get('/products/:id', [authMiddleware, authorized], async (req, res) => {
    try {

        const { page, limit } = req.query
        const PAGE_SIZE = limit;
        const skip = (page - 1) * PAGE_SIZE;
        const products = await Product.find({ deleted_at: null, business: req.params.id }).populate('category').skip(skip)
            .limit(PAGE_SIZE);
        console.log(products)
        return res.status(200).json({ message: 'Successfull pulled ', products });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.put('/product/:id', [authMiddleware, authorized], async (req, res) => {
    try {
        const prod = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, useFindAndModify: false })
        return res.status(200).json({ message: 'Successfull Update ', prod });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});

router.put('/product/:id/delete_image', [authMiddleware, authorized], async (req, res) => {
    try {
        const prod = await Product.findById(req.params.id);

        fs.unlink(__dirname + './../uploads/products/' + path.basename(prod.images[req.body.index]), async (err) => {
            if (err) throw err;
            let newImages = prod.images.splice(req.body.index, 1)
            await Product.findOneAndUpdate({ _id: req.params.id }, { images: newImages }, { new: true, useFindAndModify: false })
            return res.status(200).json({ message: 'successfully deleted file ' });
        });
        //


    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});

router.put('/product/:id/update_images', upload.array('images'), [authMiddleware, authorized], async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        const reqFiles = [];
        const url = req.protocol + '://' + req.get('host')
        for (var i = 0; i < req.files.length; i++) {
            reqFiles.push(url + '/uploads/products/' + req.files[i].filename);
            await imagemin(["uploads/products/" + req.files[i].filename], {
                destination: "uploads/products",
                plugins: [
                    imageminMozJpeg({ quality: 30 })
                ]
            })

        }

        req.body.images = reqFiles
        let newimages = product.images.concat(reqFiles)
        const update = await Product.findOneAndUpdate({ _id: req.params.id }, { images: newimages }, { new: true, useFindAndModify: false })
        return res.status(200).json({ message: 'Images Updated Successfully', update });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.get('/product/search/:key', [authMiddleware, authorized], async (req, res) => {
    try {
        let result = await Product.find({
            "$or": [
                {
                    product_name: {
                        $regex: req.params.key
                    },
                    // color: {
                    //     $regex: req.params.key
                    // },
                    // price: {
                    //     $regex: req.params.key
                    // }
                }
            ]
        })
        return res.status(200).json({ message: 'Successfull Update ', result });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});
router.get('/product/:id', [authMiddleware, authorized], async (req, res) => {
    try {
        const prod = await Product.findById(req.params.id);

        return res.status(200).json({ message: 'Successfull Update ', prod });

    } catch (error) {

        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});


module.exports = router;