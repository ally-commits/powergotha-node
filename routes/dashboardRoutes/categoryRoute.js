const {Router} = require('express')
const categoryController = require('../../controllers/dashboard/categoryController')

const router = Router();
 
// ADMIN ACCESS
router.get("/getAllCategory",categoryController.getAllCategory)
router.post("/addCategory",categoryController.addCategory)
router.put("/editCategory",categoryController.editCategory)
router.delete("/deleteCategory",categoryController.deleteCategory)

module.exports = router;