const {Router} = require('express')
const userController = require('../../controllers/user/userController')

const router = Router();
  
router.get("/getUserDetails",userController.getUserDetails);
router.post("/updateUserDetails",userController.updateUserDetails);  
router.post("/changePassword",userController.changePassword);
router.post("/updatePassword",userController.updatePassword);
router.post("/updateAddress",userController.updateAddress);  

module.exports = router;