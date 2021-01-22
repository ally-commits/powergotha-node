const {Router} = require('express')
const doctorController = require('../../controllers/user/doctorController')

const router = Router();
  
router.get("/getAllDoctors",doctorController.getAllDoctors);
router.post("/askAppointment",doctorController.askAppointment);
router.post("/cancelAppointment",doctorController.cancelAppointment);


module.exports = router;