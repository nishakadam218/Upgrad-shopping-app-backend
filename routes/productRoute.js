const express = require("express");
const router = express.Router();

const { createProduct, getAllProducts, updateProduct, deleteProduct, getProductDetails, getAdminProducts } = require("../controller/productController")
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")

router.route("/products").get(getAllProducts)

router.route("/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct)

router.route("/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct).get(getProductDetails)
router
    .route("/admin/products")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router
    .route("/admin/product/new")
    .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router
    .route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

module.exports = router;