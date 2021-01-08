const {Router} = require('express')
const feedReportController = require('../../controllers/user/feedReportController')

const router = Router();
 
// USER ACCESS
router.get("/getFeedReport",feedReportController.getFeedReport);     
router.post("/addFeedReport",feedReportController.addFeedReport);     
router.put("/editFeedReport",feedReportController.editFeedReport);     
router.get("/totalFeed",feedReportController.totalFeed);     

module.exports = router;