const {Router} = require('express')
const authController = require('../../controllers/user/authController')

const router = Router();
 
// USER ACCESS
router.post("/sendOtp",authController.sendOtp); 

router.post("/loginWithPhoneNumber",authController.loginWithPhoneNumber);  
router.post("/registerWithPhoneNumber",authController.registerWithPhoneNumber);  

router.post("/loginWithEmail",authController.loginWithEmail);  
router.post("/registerWithEmail",authController.registerWithEmail);  

module.exports = router;