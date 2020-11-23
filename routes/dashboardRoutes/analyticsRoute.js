const {Router} = require('express')
const analyticsController = require('../../controllers/dashboard/analyticsController')

const router = Router();
 
// ADMIN ACCESS
router.get("/getDetails",analyticsController.getDetails) 

module.exports = router;