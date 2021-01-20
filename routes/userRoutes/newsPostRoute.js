const {Router} = require('express')
const newsController = require('../../controllers/user/newsController')

const router = Router();
 
// USER ACCESS
router.get("/getAllNewsPost",newsController.getAllNewsPost);        

module.exports = router;