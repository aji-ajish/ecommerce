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
router.route('/review').put(isAuthenticatedUser, createReview)
    .delete(deleteReview)

// Admin routes                 
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), upload.array('images'), newProduct)
router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts)
router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)
router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRoles('admin'), upload.array('images'), updateProduct)
router.route('/admin/reviews').get(isAuthenticatedUser, authorizeRoles('admin'),getReview)
router.route('/admin/reviews').delete(isAuthenticatedUser, authorizeRoles('admin'),deleteReview)

module.exports = router