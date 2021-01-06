const {Router} = require('express')
const milkController = require('../../controllers/reports/milkController')

const router = Router();
 
// USER ACCESS
router.get("/totalMilkProduction",milkController.totalMilkProduction);     
router.get("/averageFat",milkController.averageFat);     
router.get("/averageSnf",milkController.averageSnf);     

module.exports = router;