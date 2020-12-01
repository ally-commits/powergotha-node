const {Router} = require('express')
const blogController = require('../../controllers/dashboard/blogController')

const router = Router();
 
// USER ACCESS
router.get("/getAllBlogPost",blogController.getAllBlogPost);    
router.post("/addBlogPost",blogController.addBlogPost);    
router.put("/editBlogPost",blogController.editBlogPost);    
router.delete("/deleteBlogPost",blogController.deleteBlogPost);    

module.exports = router;