const {Router} = require('express')
const productController = require('../../controllers/userApp/productController')

const router = Router();
 
router.get("/getAllProduct",productController.getAllProduct)

module.exports = router;