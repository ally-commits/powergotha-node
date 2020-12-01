const {Router} = require('express')
const endUserController = require('../../controllers/user/endUserController')

const router = Router();
 
// USER ACCESS
router.get("/getAllUsers",endUserController.getAllUsers);    
router.post("/addUser",endUserController.addUser);    
router.put("/editUser",endUserController.editUser);    
router.delete("/deleteUser",endUserController.deleteUser);    

module.exports = router;