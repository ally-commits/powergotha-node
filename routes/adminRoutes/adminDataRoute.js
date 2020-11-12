const {Router} = require('express')
const dataMaker = require('../../data/func')

const router = Router();
 
// ADMIN ACCESS
router.get("/addProducts",dataMaker.addProducts) 

module.exports = router;