const express = require('express');
const router = express.Router();
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct } = require('../Controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

router.route('/products').get(isAuthenticatedUser, getProducts)
router.route('/product/:id').get(getSingleProduct)
                            .put(updateProduct)
                            .delete(deleteProduct)

// Admin routes                 
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct)
module.exports = router