const {Router} = require('express')
const userController = require('../../controllers/userApp/userController')

const router = Router();

router.get("/getUserDetails", userController.getUserDetails);

router.get("/productRecommendations", userController.productRecommendations); 
router.post("/addAddress", userController.addAddress); 
router.put("/editAddress", userController.updateAddress); 
router.delete("/deleteAddress", userController.deleteAddress); 

module.exports = router;