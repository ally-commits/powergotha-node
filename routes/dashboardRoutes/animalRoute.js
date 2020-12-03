const {Router} = require('express')
const animalController = require('../../controllers/dashboard/animalController')

const router = Router();
 
// USER ACCESS
router.get("/getAnimalUserList",animalController.getAllList);   
router.get("/getAllAnimalList",animalController.getAllAnimalList);  
router.post("/addAnimal",animalController.addAnimal);    
router.put("/editAnimal",animalController.editAnimal);    
router.delete("/deleteAnimal",animalController.deleteAnimal);    

module.exports = router;