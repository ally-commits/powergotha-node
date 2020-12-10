const {Router} = require('express')
const breedingRecordController = require('../../controllers/user/breedingRecordController')

const router = Router();
 
// USER ACCESS
router.get("/getBreedingRecord",breedingRecordController.getBreedingRecord);     
router.post("/addBreedingRecord",breedingRecordController.addBreedingRecord);     

module.exports = router;