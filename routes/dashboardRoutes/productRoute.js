const {Router} = require('express')
const productController = require('../../controllers/dashboard/productController')

const router = Router();
 
// ADMIN ACCESS
router.get("/getAllProduct",productController.getAllProduct)
router.post("/addProduct",productController.addProduct)
router.put("/editProduct",productController.editProduct)
router.delete("/deleteProduct",productController.deleteProduct)

module.exports = router;