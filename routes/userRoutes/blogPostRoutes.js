const {Router} = require('express')
const blogController = require('../../controllers/user/blogController')

const router = Router();
 
// DOCTOR ACCESS
router.get("/getAllBlogPost",blogController.getAllBlogPost);    

router.put("/dislikeBlogPost",blogController.dislikeBlogPost);
router.put("/likeBlogPost",blogController.likeBlogPost);  

router.get("/getFavoriteBlogPost",blogController.getFavoriteBlogPost);    
router.put("/addToFavorite",blogController.addToFavorite);    
router.put("/removeFromFavorite",blogController.removeFromFavorite);    


module.exports = router;