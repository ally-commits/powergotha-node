const {Router} = require('express')
const blogController = require('../../controllers/user/blogController')

const router = Router();
 
// DOCTOR ACCESS
router.get("/getAllBlogPost",blogController.getAllBlogPost);    

router.put("/likeBlogPost",blogController.likeBlogPost);    

module.exports = router;