const {Router} = require('express')
const feedbackController = require('../../controllers/dashboard/feedbackController')

const router = Router();
 
// USER ACCESS
router.get("/getAllFeedback",feedbackController.getAllFeedback);   
router.put("/reply",feedbackController.reply);        

module.exports = router;