const {Router} = require('express')
const adminCategoryController = require('../../controllers/admin/adminCategoryController')

const router = Router();
 
// ADMIN ACCESS
router.get("/getAllCategory",adminCategoryController.getAllCategory)
router.post("/addCategory",adminCategoryController.addCategory)
router.put("/editCategory",adminCategoryController.editCategory)
router.delete("/deleteCategory",adminCategoryController.deleteCategory)

module.exports = router;