const {Router} = require('express')
const animalController = require('../../controllers/user/animalController')

const router = Router();
 
// USER ACCESS
router.get("/getAllAnimal",animalController.getAllAnimal);    
router.post("/addAnimal",animalController.addAnimal);    
router.put("/editAnimal",animalController.editAnimal);    
router.delete("/deleteAnimal",animalController.deleteAnimal);    

module.exports = router;