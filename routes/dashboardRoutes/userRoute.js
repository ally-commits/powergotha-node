const {Router} = require('express')
const userController = require('../../controllers/dashboard/userController')

const router = Router();
  
router.get("/getUserDetails",userController.getUserDetails);
router.post("/updateUserDetails",userController.updateUserDetails);  
router.post("/changePassword",userController.changePassword);

module.exports = router;