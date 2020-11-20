const {Router} = require('express')
const delvBoyController = require('../../controllers/dashboard/delvBoyController')

const router = Router();
 
// ADMIN ACCESS
router.get("/getAllUsers",delvBoyController.getAllUsers)
router.post("/addUser",delvBoyController.addUser)
router.put("/editUser",delvBoyController.editUser)
router.delete("/deleteUser",delvBoyController.deleteUser)

module.exports = router;