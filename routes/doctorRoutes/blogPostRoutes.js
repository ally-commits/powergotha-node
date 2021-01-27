const {Router} = require('express')
const blogController = require('../../controllers/doctor/blogController')

const router = Router();
 
// DOCTOR ACCESS
router.get("/getAllBlogPost",blogController.getAllBlogPost);    
router.post("/addBlogPost",blogController.addBlogPost);    
router.put("/editBlogPost",blogController.editBlogPost);    
router.delete("/deleteBlogPost",blogController.deleteBlogPost);    
router.put("/likeBlogPost",blogController.likeBlogPost);    
router.put("/dislikeBlogPost",blogController.dislikeBlogPost);
router.get("/getFavoriteBlogPost",blogController.getFavoriteBlogPost);    
router.put("/addToFavorite",blogController.addToFavorite);    
router.put("/removeFromFavorite",blogController.removeFromFavorite);   
module.exports = router;