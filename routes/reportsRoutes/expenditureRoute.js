const {Router} = require('express')
const expenditureController = require('../../controllers/reports/expenditureController')

const router = Router();
 
// USER ACCESS
router.get("/getAllExpenditure",expenditureController.getAllExpenditure);     

module.exports = router;