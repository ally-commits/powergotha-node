const Card = require("../../models/Card");
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger");

module.exports.getCards = async (req, res) => {
    const userId = req.user._id;
    try {
        const card = await Card.find({userId}) 

        if(card) {
            logger.info("card item found" + card)
            res.status(201).json({ card});
        } else 
            throw Error("cards Not Found");
    }
    catch(err) { 
        logger.error("GET CARD ITEMS: " + err)
        let error = err.message 
        res.status(400).json({ error: error });
    }  
}


module.exports.addCard = [
    body('bankName').not().isEmpty().withMessage("bankName is required"),
    body('cardNumber').not().isEmpty().withMessage("cardNumber is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user._id;
        const {bankName,cardNumber} = req.body;
        try {
            const cardItem = await Card.findOne({cardNumber,userId});
            if(cardItem) {
                throw Error("Card already saved")
            } else {
                const card = await Card.create({bankName,userId,cardNumber}); 
                logger.info("card added" + card)
                res.status(201).json({ card, message: "Card Added Successfully"}); 
            } 
        }
        catch(err) { 
            logger.error("ADD CARD: " + err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]



module.exports.editCard = [
    body('bankName').not().isEmpty().withMessage("bankName is required"),
    body('cardNumber').not().isEmpty().withMessage("cardNumber is required"),
    body('cardId').not().isEmpty().withMessage("cardId is required"),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user._id;
        const {bankName,cardNumber,cardId} = req.body;
        try {
            const card = await Card.findOneAndUpdate({_id: cardId,userId},{bankName,cardNumber}); 
            if(card) {
                const cardItem = await Card.findById(cardId);
                logger.info("Card modified" + cardItem)
                res.status(201).json({ message: "Card Updated Successfully",card: cardItem}); 
            } else
                throw Error("No Card  Found")
        }
        catch(err) { 
            logger.error("MODIFY CARD: " + err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.removeCard = [
    
    body('cardId').not().isEmpty().withMessage("cardId is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user._id;
        const { cardId } = req.body;
        try {
            const card = await Card.remove({_id: cardId,userId}); 
            if(card) {
                logger.info("Card item deleted:" + cardId)
                res.status(201).json({ message: "Card Removed Successfully"}); 
            } else 
                throw Error("No Card Found") 
        }
        catch(err) { 
            logger.error("DELETE CARD: " + err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]
   