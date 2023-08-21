const express=require("express");
const erroemiddleware=require("./middleware/error");
const cookieParser=require("cookie-parser");
const app=express();
const bodyParser=require("body-parser");
const fileupload=require("express-fileupload");
const dotenv=require("dotenv");
app.use(express.json({limit: '50mb'}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileupload());

// config

dotenv.config({path:"Backend/config/config.env"});

// routes import
const user=require("./routes/userroute")
const product=require("./routes/productroutes");
const order=require("./routes/orderroutes");
const fileUpload = require("express-fileupload");
const payment=require("./routes/paymentroute");


app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment);

// middle ware error

app.use(erroemiddleware);

module.exports=app