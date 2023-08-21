import './App.css';
import Header  from './component/layout/Header/Headers.js';
import React,{useState} from 'react';
import {BrowserRouter as Router,Route, Routes,Navigate} from "react-router-dom"
import webofont from 'webfontloader'
import Footer from './component/layout/Footer/Footer.js';
import Home from './component/Home/Home.js'
import ProductDetail from "./component/Product/ProductDetail.js"
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import LoginSignUp from './component/User/LoginSignUp.js';
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js"
import ProtectedRoute from "./component/Route/ProtectedRoute"
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetForgotPassword from "./component/User/ResetForgotPassword.js"
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import axios from "axios";
import Payment from "./component/Cart/Payment.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/admin/Dashboard.js"
import ProductList from "./component/admin/ProductList.js"
import NewProduct from "./component/admin/NewProduct.js"
import UpdateProduct from "./component/admin/UpdateProduct.js"
import OrderList from "./component/admin/OrderList.js";
import ProcessOrder from "./component/admin/ProcessOrder.js"
import UsersList from "./component/admin/UsersList.js"
import ProductReviews from "./component/admin/ProductReviews.js"
import UpdateUser from "./component/admin/UpdateUser.js"
function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);
  

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  

  React.useEffect(()=>{
    webofont.load({
      google:{
        families:["Roboto","Droid Sans","Chilanka"],
      },
    });
    

    store.dispatch(loadUser());


    getStripeApiKey();
  },[]);
  return (
    <Router>
      <Header/>
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
      <Route exact path='/' Component={Home}/>
      <Route exact path='/product/:id' element={<ProductDetail/>}/>
      <Route exact path='/products' element={<Products/>}/>
      <Route exact path='/products/:keyword' element={<Products/>}/>
      <Route exact path="/Search" element={<Search/>} />
      <Route exact path="/account" element={<ProtectedRoute/> ? <Profile /> : <Navigate to="/login" />}/>
      <Route exact path="/me/update"  element={<ProtectedRoute/>  ? <UpdateProfile /> : <Navigate to="/login" />}/>
      <Route exact path="/password/update"  element={<ProtectedRoute/>  ? <UpdatePassword /> : <Navigate to="/account" />}/>
      <Route exact path="/password/forgot"  element={ <ForgotPassword />}/>
      <Route exact path="/password/reset/:token"  element={ <ResetForgotPassword />}/>
      <Route exact path="/login" element={<LoginSignUp/>} />
      <Route exact path="/login/shipping"  element={<ProtectedRoute/>  ? <Shipping /> : <Navigate to="/login" />}/>
      
      <Route exact path="/success"  element={<ProtectedRoute/> ? <OrderSuccess /> : <Navigate to="/cart" />}/>
      <Route exact path="/cart" element={<Cart/>} /> 
      <Route path="/process/payment"
        element={<Elements stripe={loadStripe(stripeApiKey)}>
          {isAuthenticated ? <Payment /> : <Navigate to="/login" />}
        </Elements>}
      />
      <Route exact path="/orders"  element={<ProtectedRoute/> ? <MyOrders /> : <Navigate to="/login" />}/>
      <Route exact path="/order/confirm"  element={<ProtectedRoute/>  ? <ConfirmOrder /> : <Navigate to="/cart" />}/>
      <Route exact path="/order/:id"  element={<ProtectedRoute/> ? <OrderDetails /> : <Navigate to="/login" />}/>
      <Route exact path="/admin/dashboard" isAdmin={true} element={<ProtectedRoute/> ? <Dashboard /> : <Navigate to="/login" />}/>
      <Route exact path="/admin/products" isAdmin={true} element={<ProtectedRoute/> ? <ProductList /> : <Navigate to="/login" />}/>
      <Route exact path="/admin/product" isAdmin={true} element={<ProtectedRoute/> ? <NewProduct /> : <Navigate to="/login" />}/>
      <Route exact path="/admin/product/:id" isAdmin={true} element={<ProtectedRoute/> ? <UpdateProduct /> : <Navigate to="/login" />}/>
      <Route exact path="/admin/orders" isAdmin={true} element={<ProtectedRoute/> ? <OrderList /> : <Navigate to="/login" />}/>
      <Route exact path="/admin/order/:id" isAdmin={true} element={<ProtectedRoute/> ? <ProcessOrder /> : <Navigate to="/login" />}/>
      <Route exact path="/admin/users" isAdmin={true} element={<ProtectedRoute/> ? <UsersList /> : <Navigate to="/login" />}/>
      <Route exact path="/admin/reviews" isAdmin={true} element={<ProtectedRoute/> ? <ProductReviews /> : <Navigate to="/login" />}/>
      <Route exact path="/admin/user/:id" isAdmin={true} element={<ProtectedRoute/> ? <UpdateUser /> : <Navigate to="/login" />}/>




      </Routes>
      <Footer/>
    </Router> 

  );
}

export default App;
