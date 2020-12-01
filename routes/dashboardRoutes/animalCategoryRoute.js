const {Router} = require('express')
const animalCategoryController = require('../../controllers/dashboard/animalCategoryController')

const router = Router();
 
// USER ACCESS
router.get("/getAllCategory",animalCategoryController.getAllCategory);    
router.post("/addCategory",animalCategoryController.addCategory);    
router.put("/editCategory",animalCategoryController.editCategory);    
router.delete("/deleteCategory",animalCategoryController.deleteCategory);    

module.exports = router;