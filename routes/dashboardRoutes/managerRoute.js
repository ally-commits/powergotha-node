const {Router} = require('express')
const managerController = require('../../controllers/dashboard/managerController')

const router = Router();
 
// ADMIN ACCESS
router.get("/getAllManagers",managerController.getAllManagers)
router.post("/addManager",managerController.addManager)
router.put("/editManager",managerController.editManager)
router.delete("/deleteManager",managerController.deleteManager)

module.exports = router;