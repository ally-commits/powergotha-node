const {Router} = require('express')
const orderController = require('../../controllers/dashboard/orderController')

const router = Router();
 
// ADMIN ACCESS
router.get("/getAllOrders",orderController.getAllOrders)
router.put("/updateOrderStatus",orderController.updateOrderStatus) 

module.exports = router;