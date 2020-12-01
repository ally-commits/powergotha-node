const {Router} = require('express')
const authController = require('../../controllers/user/authController')

const router = Router();
 
// USER ACCESS
router.post("/sendOtp",authController.sendOtp);  
router.post("/loginWithPhoneNumber",authController.loginWithPhoneNumber);  
router.post("/registerWithPhoneNumber",authController.registerWithPhoneNumber);  

module.exports = router;