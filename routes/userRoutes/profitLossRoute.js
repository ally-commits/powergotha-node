const {Router} = require('express')
const profitLossController = require('../../controllers/user/profitLossController')

const router = Router();
 
// USER ACCESS
  
router.get("/profitLossReport",profitLossController.profitLossReport);    

module.exports = router;