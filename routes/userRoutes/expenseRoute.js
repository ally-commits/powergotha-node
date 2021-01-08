const {Router} = require('express')
const expenseController = require('../../controllers/user/expenseController')

const router = Router();
 
// USER ACCESS
router.post("/addExpense",expenseController.addExpense);    
router.get("/getAllExpense",expenseController.getAllExpense);    
router.put("/editExpense",expenseController.editExpense);    
router.get("/totalExpense",expenseController.totalExpense);    

module.exports = router;