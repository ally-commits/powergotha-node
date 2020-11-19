const express = require('express');
const mongoose = require('mongoose'); 

const authRoute = require("./routes/userAppRoutes/authRoute") 
const userRoute = require("./routes/userAppRoutes/userRoute")
const productRoute = require("./routes/userAppRoutes/productRoute")
const orderRoute = require("./routes/userAppRoutes/orderRoute")
const cartRoute = require("./routes/userAppRoutes/cartRoute")
const categoryRoute = require("./routes/userAppRoutes/categoryRoute")

const dashboardProductRoute = require("./routes/dashboardRoutes/productRoute")
const dashboardCategoryRoute = require("./routes/dashboardRoutes/categoryRoute")
const warehouseRoute = require("./routes/dashboardRoutes/warehouseRoute")
const managerRoute = require("./routes/dashboardRoutes/managerRoute") 

const cors = require('cors');
const { checkPermission } = require('./middleware/checkPermission');
const app = express();

app.use(cors())
app.use(express.static('public'));
app.use(express.json()); 
 
const PORT = 9000;

// const dbURI = 'mongodb+srv://ally:Asd@1234@cluster0.e694a.mongodb.net/yopaan-node?retryWrites=true&w=majority';
const dbURI = 'mongodb://root:BqYtiYJDgtA9@52.66.209.53:27017/yopaan-node?authSource=admin';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true ,useFindAndModify: false})
    .then((result) => {
        app.listen(PORT,() => {
            console.log("Application Started in Port " + PORT)
        })
    })
    .catch((err) => console.log(err));
 
// LOGIN - REGISTER NON-AUTH ROUTES
app.use("/api/auth", authRoute);

// USER - LEVEL - ROUTES
app.use("/api/user", checkPermission(["USER","ADMIN"]), userRoute);
app.use("/api/product", checkPermission(["USER"]), productRoute)
app.use("/api/category", checkPermission(["USER"]), categoryRoute)
app.use("/api/order", checkPermission(["USER"]), orderRoute)
app.use("/api/cart", checkPermission(["USER"]), cartRoute)

 
 
// ONLY ADMIN ACCESSS
app.use("/api/admin/warehouse", checkPermission(["ADMIN"]), warehouseRoute)
app.use("/api/admin/manager", checkPermission(["ADMIN"]), managerRoute)

// ADMINN _ MANAGER ACCESS ROUTES
app.use("/api/dashboard/product",checkPermission(["ADMIN","MANAGER"]) ,dashboardProductRoute)
app.use("/api/dashboard/category",checkPermission(["ADMIN","MANAGER"]),dashboardCategoryRoute)