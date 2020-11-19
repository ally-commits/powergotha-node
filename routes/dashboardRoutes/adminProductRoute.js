const {Router} = require('express')
const adminProductController = require('../../controllers/dashboard/adminProductController')

const router = Router();
 
// ADMIN ACCESS
router.get("/getAllProduct",adminProductController.getAllProduct)
router.post("/addProduct",adminProductController.addProduct)
router.put("/editProduct",adminProductController.editProduct)
router.delete("/deleteProduct",adminProductController.deleteProduct)

module.exports = router;