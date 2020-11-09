const {Router} = require('express')
const userController = require('../controllers/userController')

const router = Router();

router.get("/getUserDetails", userController.getUserDetails); 

router.post("/addAddress", userController.addAddress); 
router.put("/editAddress", userController.updateAddress); 
router.delete("/deleteAddress", userController.deleteAddress); 

module.exports = router;