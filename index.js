const express = require('express');
const mongoose = require('mongoose'); 

const authRoute = require("./routes/userRoutes/authRoute") 
const userRoute = require("./routes/userRoutes/userRoute")
const productRoute = require("./routes/userRoutes/productRoute")
const orderRoute = require("./routes/userRoutes/orderRoute")
const cartRoute = require("./routes/userRoutes/cartRoute")

const adminProductRoute = require("./routes/adminRoutes/adminProductRoute")

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
 

// USER - LEVEL - ROUTES
app.use("/api/auth", authRoute);
app.use("/api/user", checkPermission(["USER"]), userRoute);
app.use("/api/product", checkPermission(["USER"]), productRoute)
app.use("/api/order", checkPermission(["USER"]), orderRoute)
app.use("/api/cart", checkPermission(["USER"]), cartRoute)

// ADMIN - LEVEL - ROUTES
app.use("/api/admin/product",adminProductRoute)


 