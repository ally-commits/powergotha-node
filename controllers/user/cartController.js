const Cart = require("../../models/Cart");

module.exports.getCartItems = async (req, res) => {
    const userId = req.user._id;
    try {
        const cart = await Cart.find({userId}).populate("productId");
        if(cart) {
            res.status(201).json({ cart});
        } else 
            throw Error("Cart Items Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }  
}


module.exports.addToCart = async (req, res) => {
    const userId = req.user._id;
    const {productId,quantity} = req.body;
    try {
        const cart = await Cart.create({productId,userId,quantity}); 
        res.status(201).json({ cart, message: "Cart Item Added Successfully"}); 
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}



module.exports.modifyQuantity = async (req, res) => {
    const userId = req.user._id;
    console.log(userId)
    const {cartId,quantity} = req.body;
    try {
        const cart = await Cart.findOneAndUpdate({_id: cartId,userId},{quantity}); 
        if(cart) {
            const cartItem = await Cart.findById(cartId);
            res.status(201).json({ message: "Cart Updated Successfully",cart: cartItem}); 
        } else
            throw Error("No Cart Items Found")
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.removeFromCart = async (req, res) => {
    const userId = req.user._id;
    const { cartId } = req.body;
    try {
        const cart = await Cart.findOneAndRemove({_id: cartId,userId}); 
        if(cart) {
            res.status(201).json({ message: "Cart Item Removed Successfully"}); 
        } else 
            throw Error("No Cart Item Found") 
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
   