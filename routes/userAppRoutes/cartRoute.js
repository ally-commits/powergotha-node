const {Router} = require('express')
const cartController = require('../../controllers/userApp/cartController')

const router = Router();

router.get("/getCartItems",cartController.getCartItems) 
router.post("/addToCart",cartController.addToCart)
router.put("/modifyQuantity",cartController.modifyQuantity)
router.delete("/removeFromCart",cartController.removeFromCart)

module.exports = router;