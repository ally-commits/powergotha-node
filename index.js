const express = require('express');
const mongoose = require('mongoose'); 
require('dotenv').config()
const httpLogger = require('./middleware/httpLogger.js');
// const logger = require('./logger/logger');

const authRoute = require("./routes/allUserRoutes/authRoute") 
const userDetialRoute = require("./routes/allUserRoutes/userDetailRoute")

const userRoute = require("./routes/userAppRoutes/userRoute")
const productRoute = require("./routes/userAppRoutes/productRoute")
const orderRoute = require("./routes/userAppRoutes/orderRoute")
const cartRoute = require("./routes/userAppRoutes/cartRoute")
const cardRoute = require("./routes/userAppRoutes/cardRoute")
const categoryRoute = require("./routes/userAppRoutes/categoryRoute")

const dashboardProductRoute = require("./routes/dashboardRoutes/productRoute")
const dashboardCategoryRoute = require("./routes/dashboardRoutes/categoryRoute")
const warehouseRoute = require("./routes/dashboardRoutes/warehouseRoute")
const managerRoute = require("./routes/dashboardRoutes/managerRoute") 
const delvBoyRoute = require("./routes/dashboardRoutes/delvBoyRoute");
const ordersRoute = require("./routes/dashboardRoutes/ordersRoute");
const analyticsRoute = require("./routes/dashboardRoutes/analyticsRoute");

const cors = require('cors');

const { checkGuestAccess } = require("./middleware/checkGuestAccess");
const { checkPermission } = require('./middleware/checkPermission');

const app = express();

app.use(httpLogger);
app.use(cors())
app.use(express.static('public'));
app.use(express.json()); 

 
const PORT = 9000;
 
// const dbURI = 'mongodb://root:BqYtiYJDgtA9@52.66.209.53:27017/yopaan-node?authSource=admin';
const dbURI = "mongodb+srv://root:Asd@1234@cluster0.3dpaa.mongodb.net/yopaan-version-1?retryWrites=true&w=majority"

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true ,useFindAndModify: false})
    .then((result) => {
        app.listen(PORT,() => {
            console.log("Application Started in Port " + PORT)
        })
    })
    .catch((err) => console.log(err));
 
// LOGIN - REGISTER ALL USERS ROUTES
app.use("/api/auth", authRoute);
app.use("/api/user", checkPermission(["USER","ADMIN","MANAGER","DELIVERY-BOY","STORE"]), userDetialRoute);

// /GUEST LEVEL ACCESS

app.use("/api/product", checkGuestAccess(), productRoute)

// USER - END-USER-LEVEL - ROUTES
app.use("/api/user", checkPermission(["USER"]), userRoute);
app.use("/api/category", checkPermission(["USER"]), categoryRoute)
app.use("/api/order", checkPermission(["USER"]), orderRoute)
app.use("/api/cart", checkPermission(["USER"]), cartRoute)
app.use("/api/card", checkPermission(["USER"]), cardRoute)
 
// ONLY ADMIN ACCESSS
app.use("/api/admin/warehouse", checkPermission(["ADMIN"]), warehouseRoute)
app.use("/api/admin/manager", checkPermission(["ADMIN"]), managerRoute)

// ADMINN _ MANAGER ACCESS ROUTES
app.use("/api/dashboard/product",checkPermission(["ADMIN","MANAGER"]) ,dashboardProductRoute)
app.use("/api/dashboard/category",checkPermission(["ADMIN","MANAGER"]),dashboardCategoryRoute)
app.use("/api/dashboard/delivery", checkPermission(["ADMIN","MANAGER"]), delvBoyRoute)
app.use("/api/dashboard/orders", checkPermission(["ADMIN","MANAGER"]), ordersRoute)

app.use("/api/dashboard/analytics", checkPermission(["ADMIN","MANAGER"]), analyticsRoute)