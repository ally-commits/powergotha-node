const {Router} = require('express')
const animalCategoryController = require('../../controllers/user/animalCategoryController')

const router = Router();
 
// USER ACCESS
router.get("/getAllCategory",animalCategoryController.getAllCategory);   

module.exports = router;