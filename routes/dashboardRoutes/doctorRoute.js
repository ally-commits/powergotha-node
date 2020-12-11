const {Router} = require('express')
const doctorController = require('../../controllers/dashboard/doctorController')

const router = Router();
 
// USER ACCESS
router.get("/getAllDoctors",doctorController.getAllDoctors);    
router.post("/addDoctor",doctorController.addDoctor);    
router.put("/editDoctor",doctorController.editDoctor);    
router.delete("/deleteDoctor",doctorController.deleteDoctor);    

module.exports = router;