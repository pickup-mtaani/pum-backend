const express = require('express');
var Product = require('models/products.model')
const imagemin = require('imagemin');
const imageminMozJpeg = require('imagemin-mozjpeg')
const { v4: uuidv4 } = require('uuid');
var multer = require('multer');
;
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
            const body = req.body
            body.createdBy = req.user._id
            body.images = reqFiles
            const newProduct = new Product(body)
            const biz = await newProduct.save()
            return res.status(200).json({ message: 'Saved', biz });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: 'operation failed ', error });
    }
});


module.exports = router;