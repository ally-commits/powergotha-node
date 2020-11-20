const {Router} = require('express')
const userController = require('../../controllers/allUser/userController')

const router = Router();

router.get("/getUserDetails", userController.getUserDetails); 
router.put("/updateUserDetails", userController.updateUserDetails); 

module.exports = router;