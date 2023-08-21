const app=require("./app");
const dotenv=require("dotenv");
const connectDatabase=require("./config/Database");
const cloudinary=require("cloudinary")

// handling uncaught error

process.on("uncaughtException",(err)=>{
    console.log('Error:'+ err.message);
    console.log("Shutting down server due to uncaught Exception ");
    process.exit(1);
});

// config

dotenv.config({path:"Backend/config/config.env"});

// connnecting to database
connectDatabase();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const server=app.listen(process.env.PORT,()=>{
    console.log('Server is working on port '+ process.env.PORT)

});
// unhadled Promise Rejection 

process.on("unhandledRejection",(err)=>{
        console.log('Error:'+ err.message);
        console.log("Shutting down server due to unhadled Promise Rejection ");

        server.close(()=>{
            process.exit(1);
        });     
});