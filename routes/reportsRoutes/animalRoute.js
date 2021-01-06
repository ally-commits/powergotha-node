const {Router} = require('express')
const animalController = require('../../controllers/reports/animalController')

const router = Router();
 
// USER ACCESS
router.get("/saleOfAnimals",animalController.saleOfAnimals);     
router.get("/reproductiveReport",animalController.reproductiveReport);     
router.get("/diseaseReport",animalController.diseaseReport);     

module.exports = router;