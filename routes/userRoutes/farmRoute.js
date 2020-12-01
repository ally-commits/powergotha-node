const {Router} = require('express')
const farmController = require('../../controllers/user/farmController')

const router = Router();
 
// USER ACCESS
router.get("/getAllFarms",farmController.getAllFarms);    
router.post("/addFarm",farmController.addFarm);    
router.put("/editFarm",farmController.editFarm);    
router.delete("/deleteFarm",farmController.deleteFarm);    

module.exports = router;