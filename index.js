const express = require('express');
const mongoose = require('mongoose'); 
const authRoute = require("./routes/authRoute") 

// const {checkPermission} = require("./middleware/checkPermission")

const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.static('public'));
app.use(express.json()); 
 
const PORT = 9000;

const dbURI = 'mongodb+srv://ally:Asd@1234@cluster0.e694a.mongodb.net/yopaan-node?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
    .then((result) => {
        app.listen(PORT,() => {
            console.log("Application Started in Port " + PORT)
        })
    })
    .catch((err) => console.log(err));
 

// ROUTES
app.use("/api/auth",authRoute);

// app.use("/api/agent/",checkPermission("USER"),agentRoute); 
// app.use("/api/admin",checkPermission("ADMIN"),adminRoute)
