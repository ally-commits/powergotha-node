const express = require('express');
const mongoose = require('mongoose'); 
require('dotenv').config()
const httpLogger = require('./middleware/httpLogger.js');

const cors = require('cors');

const dashboardAuthRoute = require("./routes/dashboardRoutes/authRoute")
const dashboardUserRoute = require("./routes/dashboardRoutes/userRoute");
const dashboardAnimalCategoryRoute = require("./routes/dashboardRoutes/animalCategoryRoute");
const dashboardBlogPostRoute = require("./routes/dashboardRoutes/blogPostRoute");
const dashboardEndUserRoute = require("./routes/dashboardRoutes/endUserRoute");

const userAuthRoute = require("./routes/userRoutes/authRoute")
const userFarmRoute = require("./routes/userRoutes/farmRoute")
const userAnimalCategoryRoute = require("./routes/userRoutes/animalCategoryRoute");
const userAnimalRoute = require("./routes/userRoutes/animalRoute");
const userFeedbackRoute = require("./routes/userRoutes/feedbackRoute");

const { checkDashboardPermission } = require('./middleware/dashboard/checkDashboardPermission.js');
const { checkUserPermission } = require('./middleware/user/checkUserPermission.js');

const app = express();

app.use(httpLogger);
app.use(cors())
app.use(express.static('public'));
app.use(express.json()); 

const PORT = 8000;
const dbURI = "mongodb+srv://root:Asd@1234@cluster0.3dpaa.mongodb.net/powergotha-version-1?retryWrites=true&w=majority"

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true ,useFindAndModify: false})
    .then((result) => {
        app.listen(PORT,() => {
            console.log("Application Started in Port " + PORT)
        })
    })
    .catch((err) => console.log(err));
 

// - DASHBOARD - ROUTES
app.use("/api/dashboard/auth", dashboardAuthRoute);
app.use("/api/dashboard/user", checkDashboardPermission(["ADMIN","CSE"]), dashboardUserRoute)
app.use("/api/dashboard/animal-category", checkDashboardPermission(["ADMIN"]), dashboardAnimalCategoryRoute)
app.use("/api/dashboard/blog-post", checkDashboardPermission(["ADMIN"]), dashboardBlogPostRoute)
app.use("/api/dashboard/end-user", checkDashboardPermission(["ADMIN"]), dashboardEndUserRoute)


//END_USER APP ROUTES 
app.use("/api/user/auth", userAuthRoute)
app.use("/api/user/farm", checkUserPermission(), userFarmRoute)
app.use("/api/user/animal-category", checkUserPermission(), userAnimalCategoryRoute)
app.use("/api/user/animal",checkUserPermission(), userAnimalRoute)
app.use("/api/user/feedback", checkUserPermission(), userFeedbackRoute)
 