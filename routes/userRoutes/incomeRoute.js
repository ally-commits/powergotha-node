const {Router} = require('express')
const incomeController = require('../../controllers/user/incomeController')

const router = Router();
 
// USER ACCESS
router.post("/addIncome",incomeController.addIncome);    
router.get("/getAllIncome",incomeController.getAllIncome);    
router.put("/editIncome",incomeController.editIncome);    
router.get("/totalIncome",incomeController.totalIncome);    

module.exports = router;