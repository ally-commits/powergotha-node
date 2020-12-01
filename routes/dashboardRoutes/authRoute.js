const {Router} = require('express')
const authController = require('../../controllers/dashboard/authController')

const router = Router();
 
// ADMIN ACCESS
router.post("/login",authController.login); 
router.post("/register",authController.register); 

module.exports = router;