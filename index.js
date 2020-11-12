const express = require('express');
const mongoose = require('mongoose'); 

const authRoute = require("./routes/userRoutes/authRoute") 
const userRoute = require("./routes/userRoutes/userRoute")
const productRoute = require("./routes/userRoutes/productRoute")
const orderRoute = require("./routes/userRoutes/orderRoute")
const cartRoute = require("./routes/userRoutes/cartRoute")
const categoryRoute = require("./routes/userRoutes/categoryRoute")

const adminProductRoute = require("./routes/adminRoutes/adminProductRoute")
const adminCategoryRoute = require("./routes/adminRoutes/adminCategoryRoute")
const adminDataRoute = require("./routes/adminRoutes/adminDataRoute")


const cors = require('cors');
const { checkPermission } = require('./middleware/checkPermission');
const app = express();

app.use(cors())
app.use(express.static('public'));
app.use(express.json()); 
 
const PORT = 9000;

const dbURI = 'mongodb+srv://ally:Asd@1234@cluster0.e694a.mongodb.net/yopaan-node?retryWrites=true&w=majority';

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
app.use("/api/user", checkPermission(["USER"]), userRoute);
app.use("/api/product", checkPermission(["USER"]), productRoute)
app.use("/api/category", checkPermission(["USER"]), categoryRoute)
app.use("/api/order", checkPermission(["USER"]), orderRoute)
app.use("/api/cart", checkPermission(["USER"]), cartRoute)


// ADMIN - LEVEL - ROUTES
app.use("/api/admin/product",adminProductRoute)
app.use("/api/admin/category",adminCategoryRoute)


//  DATA -MAKER
app.use("/api/admin/data/",adminDataRoute)