const {Router} = require('express')
const categoryController = require('../../controllers/userApp/categoryController')

const router = Router();
 
router.get("/getAllCategory",categoryController.getAllCategory)

module.exports = router;