const {Router} = require('express')
const cardController = require('../../controllers/userApp/cardController')

const router = Router();

router.get("/getCards",cardController.getCards) 
router.post("/addCard",cardController.addCard)
router.put("/editCard",cardController.editCard)
router.delete("/removeCard",cardController.removeCard)

module.exports = router;