const {Router} = require('express')
const authController = require('../../controllers/doctor/authController')

const router = Router();
 
// DOCTOR ACCESS
router.post("/login",authController.login); 

module.exports = router;