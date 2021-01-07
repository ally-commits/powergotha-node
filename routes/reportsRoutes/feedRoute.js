const {Router} = require('express')
const feedController = require('../../controllers/reports/feedController')

const router = Router();
 
// USER ACCESS
router.get("/getAllFeed",feedController.getAllFeed);     

module.exports = router;