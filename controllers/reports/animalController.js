const Animal = require("../../models/Animal"); 
const HealthRecord = require("../../models/HealthRecord"); 
const User = require("../../models/User"); 
const { body,query, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
const mongoose = require("mongoose");
var moment = require('moment'); 
module.exports.saleOfAnimals = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),


    async (req, res) => {
        const userId = req.user._id;
        let filter = req.query.filter;

        try {   

            if(filter === "today"){
               
                var now = moment().format('YYYY-MM-DD');
               
                const data = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        purchasingPrice : {$sum : "$purchasingPrice"},
                     }}
                ])
                if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "daily"){
                
                
                    const data = await Animal.aggregate([
                        {$match: {
                            "userId": new mongoose.Types.ObjectId(userId),
                            "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}
                        }},
                        {$group: {
                            _id : {key : "$date"},
                            purchasingPrice : {$sum : "$purchasingPrice"},
                         }}
                                ]).sort({ "date": -1 });
                
                 if(data) { 

                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "weekly"){
                const data = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $week : "$createdAt" }},
                        purchasingPrice : {$sum : "$purchasingPrice"},
                     }}
                    ]);
                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "monthly"){
                const data = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $month : "$createdAt" }},
                        purchasingPrice : {$sum : "$purchasingPrice"},
                    }}
                            ]);
                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "yearly"){
                const data = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $year : "$createdAt" }},
                        purchasingPrice : {$sum : "$purchasingPrice"},

                    }}
                ]);
                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }
             

            
        }
        catch(err) { 
            logger.error(err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    } 
]


module.exports.reproductiveReport = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),


    async (req, res) => {
        const userId = req.user._id;
        let filter = req.query.filter;

        try {   

            if(filter === "today"){
                var now = moment().format('YYYY-MM-DD');
               
                const data = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        pregnant: {$sum: {$cond: [{$eq:["$pregnant", true]}, 1, 0]}},
                        loctating: {$sum: {$cond: [{$eq:["$loctating", true]}, 1, 0]}}
                     }}
                ])
                if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "daily"){

                const data = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        pregnant: {$sum: {$cond: [{$eq:["$pregnant", true]}, 1, 0]}},
                        loctating: {$sum: {$cond: [{$eq:["$loctating", true]}, 1, 0]}},
                     }}
                            ]).sort({ "date": -1 });

               
                 if(data) { 
                    
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "weekly"){
                const data = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $week : "$createdAt" } },
                        pregnant: {$sum: {$cond: [{$eq:["$pregnant", true]}, 1, 0]}},
                        loctating: {$sum: {$cond: [{$eq:["$loctating", true]}, 1, 0]}},
                     }}
                    ]);
                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "monthly"){
                const data = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $month : "$createdAt" }},
                        pregnant: {$sum: {$cond: [{$eq:["$pregnant", true]}, 1, 0]}},
                        loctating: {$sum: {$cond: [{$eq:["$loctating", true]}, 1, 0]}},
                    }}
                            ]);
                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "yearly"){
                const data = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $year : "$createdAt" }},
                        pregnant: {$sum: {$cond: [{$eq:["$pregnant", true]}, 1, 0]}},
                        loctating: {$sum: {$cond: [{$eq:["$loctating", true]}, 1, 0]}},
                    }}
                ]);
                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }
             

            
        }
        catch(err) { 
            logger.error(err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    } 
]



module.exports.diseaseReport = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),


    async (req, res) => {
        const userId = req.user._id;
        let filter = req.query.filter;

        try {   

            if(filter === "today"){
                var now = moment().format('YYYY-MM-DD');
               
                const data = await HealthRecord.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))}
                    }},
                    {
                        $unwind: "$animal"
                    },
                    {$group: {
                        _id : {key : "$date"},
                        price: {$sum:  "$price"},
                        count: { $sum: 1 }
                     }}
                ])
                if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "daily"){

                const data = await HealthRecord.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}
                    }},
                    {
                        $unwind: "$animal"
                    },
                    {$group: {
                        _id : {key : "$date"},
                        price: {$sum:  "$price"},
                        count: { $sum: 1 }
                     }}
                            ]).sort({ "date": -1 });

                 if(data) { 
                    
                logger.info("Request sent back");
                res.status(201).json({ data  });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "weekly"){
                const data = await HealthRecord.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {
                        $unwind: "$animal"
                    },
                    {$group: {
                        _id : {key: { $week : "$createdAt" } },
                        price: {$sum:  "$price"},
                        count: { $sum: 1 }

                     }}
                    ]);
                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "monthly"){
                const data = await HealthRecord.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {
                        $unwind: "$animal"
                    },
                    {$group: {
                        _id : {key: { $month : "$createdAt" }},
                        price: {$sum:  "$price"},
                        count: { $sum: 1 }
                    }},
                   
                    
                            ]);
                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "yearly"){
                const data = await HealthRecord.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {
                        $unwind: "$animal"
                    },
                    {$group: {
                        _id : {key: { $year : "$createdAt" }},
                        price: {$sum:  "$price"},
                        count: { $sum: 1 }

                    }}
                ]);
                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }
             

            
        }
        catch(err) { 
            logger.error(err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    } 
]
