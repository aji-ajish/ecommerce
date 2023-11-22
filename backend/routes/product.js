const express = require('express');
const router = express.Router();
const { getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createReview, 
    getReview,
    deleteReview} = require('../Controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

router.route('/products').get(isAuthenticatedUser, getProducts)
router.route('/product/:id').get(getSingleProduct)
                            .put(updateProduct)
                            .delete(deleteProduct)
router.route('/review').put(isAuthenticatedUser, createReview)
                        .delete(deleteReview)
router.route('/reviews').get(getReview)

// Admin routes                 
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct)
module.exports = router