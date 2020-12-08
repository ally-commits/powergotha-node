const {Router} = require('express')
const cseController = require('../../controllers/dashboard/cseController')

const router = Router();
 
// USER ACCESS
router.get("/getAllUsers",cseController.getAllUsers);    
router.post("/addUser",cseController.addUser);    
router.put("/editUser",cseController.editUser);    
router.delete("/deleteUser",cseController.deleteUser);    

module.exports = router;