const {Router} = require('express')
const farmController = require('../../controllers/dashboard/farmController')

const router = Router();
 
// USER ACCESS
router.get("/getAllFarmList",farmController.getAllFarmList);    
router.post("/addFarm",farmController.addFarm);    
router.put("/editFarm",farmController.editFarm);    
router.delete("/deleteFarm",farmController.deleteFarm);    

module.exports = router;