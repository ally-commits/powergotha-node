const {Router} = require('express')
const newsController = require('../../controllers/dashboard/newsController')

const router = Router();
 
// USER ACCESS
router.get("/getAllNewsPost",newsController.getAllNewsPost);    
router.post("/addNewsPost",newsController.addNewsPost);    
router.put("/editNewsPost",newsController.editNewsPost);    
router.delete("/deleteNewsPost",newsController.deleteNewsPost);    

module.exports = router;