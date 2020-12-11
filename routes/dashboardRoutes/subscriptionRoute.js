const {Router} = require('express')
const subscriptionController = require('../../controllers/dashboard/subscriptionController')

const router = Router();
 
// USER ACCESS
router.get("/getAllSubscription",subscriptionController.getAllSubscription);    
router.post("/addSubscription",subscriptionController.addSubscription);    
router.put("/editSubscription",subscriptionController.editSubscription);    
router.delete("/deleteSubscription",subscriptionController.deleteSubscription);    

module.exports = router;