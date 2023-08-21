import React ,{useEffect,useState} from 'react'
import Carousel from './Carousel.js';
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetail,newReview } from '../../actions/productAction';
import { useParams } from 'react-router-dom';
import ReactStars from "react-rating-stars-component";
import ReviewCard from './ReviewCard.js'
import Loader from '../layout/Loader/Loader.js';
import { useAlert } from 'react-alert';
import { addItemsToCart } from "../../actions/cartAction";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constents/productConstant";

const ProductDetail = ({match}) => {

    const { products,loading ,error } = useSelector(
        (state) => state.productDetail
    );

    const { success, error: reviewError } = useSelector(
      (state) => state.newReview
    );

    const option={
        edit:false,
        color:"rgba(20,20,20,0,1)",
        activeColor:"tomato",
        size: window.innerWidth<600 ? 20:25,
        value:products.ratings,
        isHalf:true,
      };

      const [quantity, setQuantity] = useState(1);
      const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

    const dispatch = useDispatch();
    const alert = useAlert();
    const { id } = useParams();

    const increaseQuantity = () => {
      if (products.stock <= quantity) return;
  
      const qty = quantity + 1;
      setQuantity(qty);
    };


    const decreaseQuantity = () => {
      if (1 >= quantity) return;
  
      const qty = quantity - 1;
      setQuantity(qty);
    };
  
    const addToCartHandler = () => {
      dispatch(addItemsToCart(id, quantity));
      alert.success("Item Added To Cart");
    };

    const submitReviewToggle = () => {
      open ? setOpen(false) : setOpen(true);
    };
  
    const reviewSubmitHandler = () => {
      const myForm = new FormData();
  
      myForm.set("rating", rating);
      myForm.set("comment", comment);
      myForm.set("productId", id);
  
      dispatch(newReview(myForm));
  
      setOpen(false);
    };

    useEffect(() => {
      if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }
  
      if (reviewError) {
        alert.error(reviewError);
        dispatch(clearErrors());
      }
  
      if (success) {
        alert.success("Review Submitted Successfully");
        dispatch({ type: NEW_REVIEW_RESET });
      }
      dispatch(getProductDetail(id));
    }, [dispatch, id, error, alert, reviewError, success]);
  return (
    <>
    {loading? <Loader/>:(
        <>
        <div className='ProductDetails'>
            <div >
                <Carousel products={products} />
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{products.name}</h2>
                <p>Product # {products._id}</p>
              </div>
              <div className="detailsBlock-2">
              <ReactStars {...option}/>
                <span className="detailsBlock-2-span">
                  {" "}
                  ({products.numberofreview} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${products.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity}  />
                    <button onClick={increaseQuantity} >+</button>
                  </div>
                  <button disabled={products.stock < 1 ? true : false}
                    onClick={addToCartHandler}>
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={products.Stock < 1 ? "redColor" : "greenColor"}>
                    {products.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{products.description}</p>
              </div>
              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
              </div>
        </div>

        <h3 className="reviewsHeading">REVIEWS</h3>

        <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

        {products.reviews && products.reviews[0] ? (
            <div className="reviews">
              {products.reviews &&
                products.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
    </>
    )}
    </>
  )
};

export default ProductDetail