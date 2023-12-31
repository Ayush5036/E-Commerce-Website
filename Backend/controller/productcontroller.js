const Product=require("../models/productModel");
const Errorhandler = require("../utils/errorHandler");
const catchAsyncError=require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/ApiFeatures");
const cloudinary = require("cloudinary");


// create products-- Admin

exports.createproduct= catchAsyncError(async (req,res,next)=>{
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.Images = imagesLinks;
  req.body.user = req.user.id;

    const product= await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    });

});

// get all product

exports.getAllproducts=catchAsyncError(async(req,res)=>{

    const resultperpage=8;
    const productCount= await Product.estimatedDocumentCount();

    const apiFeatures= new ApiFeatures(Product.find(),req.query).search().filter();
    let products=await apiFeatures.query; 

    let filteredProductsCount = products.length;

    apiFeatures.pagination(resultperpage);

    // products = await apiFeatures.query;


    res.status(200).json({
        success:true,
        products,
        productCount,
        resultperpage,
        filteredProductsCount
    });
});


// Get All Product (Admin)
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details

exports.getproductDetail=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);

    if(!product){
        return next(new Errorhandler("Product Not Found",404));
    }

    res.status(200).json({
        success:true,
        product
    }) ;


});

// update product -- admin

exports.updateProduct=catchAsyncError(async(req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
        return next(new Errorhandler("Product Not Found",404));
    }

    let Images = [];

  if (typeof req.body.Images === "string") {
    Images.push(req.body.Images);
  } else {
    Images = req.body.Images;
  }

  if (Images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.Images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.Images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < Images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(Images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.Images = imagesLinks;
  }

    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        product
    });
});

// delete product -- admin

exports.deleteproduct=catchAsyncError(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);

    if(!product){
        return next(new Errorhandler("Product Not Found",404));
    }

    // Deleting Images From Cloudinary
  for (let i = 0; i < product.Images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.Images[i].public_id);
  }

    await Product.findByIdAndDelete(req.params.id,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        message:"Product deleted Successfully"
    }) ;
});


// create product review

exports.createReviewAndUpdate=catchAsyncError(async(req,res,next)=>{
    const {rating,comment,productId}=req.body;

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    };

    const product=await Product.findById(productId);


    const isReviewed= await product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString());

    if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user.toString() === req.user._id.toString()){
            (rev.rating = rating), (rev.comment = comment);
          }
        });
      } else {
        product.reviews.push(review);
        product.numberofreview = product.reviews.length;
      }
    
      let avg = 0;
    
      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
    
      product.ratings = avg / product.reviews.length;
    
      await product.save({ validateBeforeSave: false });
    
      res.status(200).json({
        success: true,
      });
});


// Get All Reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }

    
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
});
  
  // Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new Errorhandler("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
});