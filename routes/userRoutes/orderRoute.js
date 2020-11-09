const {Router} = require('express')
const orderController = require('../../controllers/user/orderController')

const router = Router();
 
router.get("/getAllOrders",orderController.getAllOrder)
router.post("/addOrder",orderController.addOrder)
router.put("/cancelOrder",orderController.cancelOrder)

module.exports = router;