import {combineReducers,applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import {configureStore} from '@reduxjs/toolkit'
import { productsDetailsReducer, productsReducer,newProductReducer , newReviewReducer,productReviewsReducer,reviewReducer,} from './reducers/productReducer';
import { profileReducer, userReducer ,forgotPasswordReducer,allUsersReducer,userDetailsReducer} from './reducers/userReducer';
import { cartReducer } from './reducers/cartReducer';
import { orderReducer ,myOrdersReducer,newOrderReducer,orderDetailsReducer,allOrdersReducer} from './reducers/orderReducer';


const reducers=combineReducers({
    products:productsReducer,
    productDetail:productsDetailsReducer,
    user:userReducer,
    profile:profileReducer,
    forgotPassword:forgotPasswordReducer,
    cart:cartReducer,
    order:orderReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    allOrders: allOrdersReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    product: productsReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
});

let intialStates={
    cart: {
        cartItems: (localStorage.getItem("cartItems"))
          ? JSON.parse(localStorage.getItem("cartItems"))
          : [],
        shippingInfo: localStorage.getItem("shippingInfo")
          ? JSON.parse(localStorage.getItem("shippingInfo"))
          : {},
      },
};

const middleware=[thunk]

const store=configureStore(
    {reducer:reducers},
    intialStates,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store;