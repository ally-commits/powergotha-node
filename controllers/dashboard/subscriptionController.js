const Subscription = require("../../models/Subscription"); 
const { body, validationResult } = require('express-validator');


module.exports.getAllSubscription = async (req, res) => {
    try {
        const subscriptions = await Subscription.find() 
        if(subscriptions) {
            res.status(201).json({ subscriptions });
        } else 
            throw Error("Subcription Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addSubscription = [
    body('name').not().isEmpty().withMessage("name field is required"),
    body('points').not().isEmpty().withMessage("points field is required"),
    body('price').not().isEmpty().withMessage("price field is required"), 
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {price, points ,name} = req.body;
        try {
            const subscription = await Subscription.create({price, points ,name});
            res.status(201).json({ subscription: subscription, message: "Subscription Added Successfully"});
        }
        catch(err) { 
            let error = err.message 
            res.status(400).json({ error: error });
        }  
    }
];

module.exports.editSubscription = [
    body('name').not().isEmpty().withMessage("name field is required"),
    body('points').not().isEmpty().withMessage("points field is required"),
    body('price').not().isEmpty().withMessage("price field is required"), 
    body('subscriptionId').not().isEmpty().withMessage("subscriptionId field is required"), 

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        const {price, points ,name,subscriptionId} = req.body;

        try { 

            const subscription = await Subscription.findByIdAndUpdate({_id: subscriptionId},{price, points ,name}); 
            if(subscription) {
                const subscriptionN = await Subscription.findById(subscriptionId);
                res.status(201).json({ message: "Subscription Updated Successfully",subscription: subscriptionN}); 
            } else 
                throw Error("No Subscription Data Found")
        }
        catch(err) { 
            let error = err.message;
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.deleteSubscription = [
    body('subscriptionId').not().isEmpty().withMessage("subscriptionId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { subscriptionId } = req.body;
        try {
            const subscription = await Subscription.delete({_id: subscriptionId}); 
            if(subscription) {
                res.status(201).json({ message: "Subscription Removed Successfully"}); 
            } else 
                throw Error("No Subscription Found") 
        }
        catch(err) { 
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]