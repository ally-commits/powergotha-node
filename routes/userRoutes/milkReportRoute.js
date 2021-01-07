const {Router} = require('express')
const milkReportController = require('../../controllers/user/milkReportController')

const router = Router();
 
// USER ACCESS
router.get("/getMilkReport",milkReportController.getMilkReport);     
router.post("/addMilkReport",milkReportController.addMilkReport);     
router.put("/editMilkReport",milkReportController.editMilkReport);     

module.exports = router;
