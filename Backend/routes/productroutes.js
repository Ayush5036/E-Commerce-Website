const express=require("express");
const { getAllproducts , createproduct, updateProduct, deleteproduct, getproductDetail, createReviewAndUpdate, getProductReviews, deleteReview, getAdminProducts} = require("../controller/productcontroller");
const { isAuthenticateUser, authrizeRoles } = require("../middleware/auth");

const router=express.Router();


router.route("/product").get( getAllproducts);
router.route("/admin/products").get(isAuthenticateUser,authrizeRoles("admin"),getAdminProducts);
router.route("/admin/product/new").post(isAuthenticateUser,authrizeRoles("admin"),createproduct);
router.route("/admin/product/:id").put(isAuthenticateUser,authrizeRoles("admin"),updateProduct).delete(isAuthenticateUser,authrizeRoles("admin"),deleteproduct);
router.route("/product/:id").get(getproductDetail);
router.route("/review").put(isAuthenticateUser,createReviewAndUpdate);
router.route("/reviews").get(getProductReviews).delete(isAuthenticateUser,deleteReview);




module.exports=router;