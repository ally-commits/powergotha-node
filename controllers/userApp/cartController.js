const Cart = require("../../models/Cart");
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger");

module.exports.getCartItems = async (req, res) => {
    const userId = req.user._id;
    try {
        const cart = await Cart.find({userId})
            .populate({path: "productId",options: { withDeleted: true }});

        if(cart) {
            logger.info("Cart items found" + cart)
            res.status(201).json({ cart});
        } else 
            throw Error("Cart Items Not Found");
    }
    catch(err) { 
        logger.error("GET CART ITEMS: " + err)
        let error = err.message 
        res.status(400).json({ error: error });
    }  
}


module.exports.addToCart = [
    body('productId').not().isEmpty().withMessage("productId is required"),
    body('quantity').not().isEmpty().withMessage("quantity is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user._id;
        const {productId,quantity} = req.body;
        try {
            const cartItem = await Cart.findOne({productId,userId});
            if(cartItem) {
                throw Error("Product Already exists in Cart")
            } else {
                const cart = await Cart.create({productId,userId,quantity}); 
                logger.info("cart items added" + cart)
                res.status(201).json({ cart, message: "Cart Item Added Successfully"}); 
            } 
        }
        catch(err) { 
            logger.error("ADD TO CART: " + err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]



module.exports.modifyQuantity = [
    body('cartId').not().isEmpty().withMessage("cartId is required"),
    body('quantity').not().isEmpty().withMessage("quantity is required"),

    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user._id;
        const {cartId,quantity} = req.body;
        try {
            const cart = await Cart.findOneAndUpdate({_id: cartId,userId},{quantity}); 
            if(cart) {
                const cartItem = await Cart.findById(cartId);
                logger.info("Cart item modified" + cartItem)
                res.status(201).json({ message: "Cart Updated Successfully",cart: cartItem}); 
            } else
                throw Error("No Cart Items Found")
        }
        catch(err) { 
            logger.error("MODIFY CART: " + err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.removeFromCart = [
    
    body('cartId').not().isEmpty().withMessage("cartId is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user._id;
        const { cartId } = req.body;
        try {
            const cart = await Cart.delete({_id: cartId,userId}); 
            if(cart) {
                logger.info("Cart item deleted:" + cartId)
                res.status(201).json({ message: "Cart Item Removed Successfully"}); 
            } else 
                throw Error("No Cart Item Found") 
        }
        catch(err) { 
            logger.error("DELETE CART: " + err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]
   