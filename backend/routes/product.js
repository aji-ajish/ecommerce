const express = require('express');
const router = express.Router();
const { getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createReview,
    getReview,
    deleteReview,
    getAdminProducts } = require('../Controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '..', 'uploads', 'products'))
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
})

router.route('/products').get(getProducts)
router.route('/product/:id').get(getSingleProduct)
    .put(updateProduct)
    .delete(deleteProduct)
router.route('/review').put(isAuthenticatedUser, createReview)
    .delete(deleteReview)
router.route('/reviews').get(getReview)

// Admin routes                 
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), upload.array('images'), newProduct)
router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts)
module.exports = router