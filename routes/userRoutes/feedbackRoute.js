const {Router} = require('express')
const feedbackController = require('../../controllers/user/feedbackController')

const router = Router();
 
// USER ACCESS
router.get("/getAllFeedback",feedbackController.getAllFeedback);    
router.post("/addFeedback",feedbackController.addFeedback);    
router.put("/editFeedback",feedbackController.editFeedback);    
router.delete("/deleteFeedback",feedbackController.deleteFeedback);    

module.exports = router;