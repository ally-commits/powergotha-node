const {Router} = require('express')
const authController = require('../../controllers/allUser/authController')

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/sendOtp", authController.sendOtp);
router.post("/verifyOtp", authController.verifyOtp);


module.exports = router;