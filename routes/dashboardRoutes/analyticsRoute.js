const {Router} = require('express')
const analyticsController = require('../../controllers/dashboard/analyticsController')

const router = Router();
 
// ADMIN ACCESS
router.get("/getAllDetails",analyticsController.getAllDetails) 

module.exports = router;