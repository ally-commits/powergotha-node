const {Router} = require('express')
const warehouseController = require('../../controllers/dashboard/warehouseController')

const router = Router();
 
// ADMIN ACCESS
router.get("/getAllWarehouse",warehouseController.getAllWarehouse)
router.post("/addWarehouse",warehouseController.addWarehouse)
router.put("/editWarehouse",warehouseController.editWarehouse)
router.delete("/deleteWarehouse",warehouseController.deleteWarehouse)

module.exports = router;