import express from "express";
import formidable from "express-formidable"
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js"
import checkId from "../middleware/checkId.js";
import { createProduct, 
    updateProduct, 
    deleteProduct, 
    getProducts, 
    getProduct, 
    getAllProducts, 
    addProductReview, 
    fetchTopProducts, 
    fetchNewProducts } from "../controllers/productController.js";

const router = express.Router()

router.route("/").get(getProducts).post(authenticate, authorizeAdmin, formidable(), createProduct)
router.route("/allproducts").get(getAllProducts)
router.route("/:productId/reviews").post(authenticate, authorizeAdmin, checkId, addProductReview)
router.get("/top", fetchTopProducts)
router.get("/new", fetchNewProducts)
router
    .route("/:productId")
    .get(authenticate, authorizeAdmin, getProduct)
    .put(authenticate, authorizeAdmin, formidable(), updateProduct)
    .delete(authenticate, authorizeAdmin, deleteProduct)

export default router