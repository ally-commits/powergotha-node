const {Router} = require('express')
const doctorController = require('../../controllers/doctor/doctorController')

const router = Router();
 
// DOCTOR ACCESS

router.get("/getDoctorDetails",doctorController.getDoctorDetails);    

module.exports = router;