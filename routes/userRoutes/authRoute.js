const {Router} = require('express')
const authController = require('../../controllers/user/authController')

const router = Router();
 
// USER ACCESS
router.post("/sendOtp",authController.sendOtp); 

router.post("/loginWithPhoneNumber",authController.loginWithPhoneNumber);  
router.post("/registerWithPhoneNumber",authController.registerWithPhoneNumber);  
router.post("/googleAuth",authController.googleAuth);  
router.post("/facebookAuth",authController.facebookAuth);  

router.post("/loginWithEmail",authController.loginWithEmail);  
router.post("/registerWithEmail",authController.registerWithEmail);  
router.post("/forgotPassword",authController.forgotPassword);  

module.exports = router;