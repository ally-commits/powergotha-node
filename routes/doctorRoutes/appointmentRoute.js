const {Router} = require('express')
const appointmentController = require('../../controllers/doctor/appointmentController')

const router = Router();
  
router.get("/getAllAppointments",appointmentController.getAllAppointments);
router.post("/acceptAppointment",appointmentController.acceptAppointment);
router.post("/rejectAppointment",appointmentController.rejectAppointment);


module.exports = router;