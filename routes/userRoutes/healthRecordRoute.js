const {Router} = require('express')
const healthRecordController = require('../../controllers/user/healthRecordController')

const router = Router();
 
// USER ACCESS
router.get("/getHealthRecord",healthRecordController.getHealthRecord);     
router.post("/addHealthRecord",healthRecordController.addHealthRecord);     

module.exports = router;