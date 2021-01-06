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

                const Today = await Animal.find({userId, date : now } , "createdAt purchasingPrice" );

                if(Today) { 
                logger.info("Request sent back");
                res.status(201).json({ Today });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "daily"){
                
                const daily = await HealthRecord.find(
                    {
                        userId,
                        "date": 
                        {
                            $gte: new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))
                        }
                    }, "purchasingPrice"
                    ).sort({ "date": -1 })

                
                 if(Daily) { 
                    purchasingPrice = {$sum : "$purchasingPrice"},

                logger.info("Request sent back");
                res.status(201).json({ Daily });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "weekly"){
                const Week = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {week: { $week : "$createdAt" }},
                        purchasingPrice : {$sum : "$purchasingPrice"},
                     }}
                    ]);
                 if(Week) { 
                logger.info("Request sent back");
                res.status(201).json({ Week });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "monthly"){
                const Month = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {month: { $month : "$createdAt" }},
                        purchasingPrice : {$sum : "$purchasingPrice"},
                    }}
                            ]);
                 if(Month) { 
                logger.info("Request sent back");
                res.status(201).json({ Month });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "yearly"){
                const Year = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {year: { $year : "$createdAt" }},
                        purchasingPrice : {$sum : "$purchasingPrice"},

                    }}
                ]);
                 if(Year) { 
                logger.info("Request sent back");
                res.status(201).json({ Year });
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
                const today = await Animal.find({userId, date : now} , "createdAt pregnant loctating" );

                if(today) { 
                logger.info("Request sent back");
                res.status(201).json({ today });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "daily"){

                const daily = await HealthRecord.find(
                    {
                        userId,
                        "date": 
                        {
                            $gte: new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))
                        }
                    }, "animal pregnant loctating"
                    ).sort({ "date": -1 })

               
                 if(daily) { 
                    
                logger.info("Request sent back");
                res.status(201).json({ daily });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "weekly"){
                const week = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {week: { $week : "$createdAt" } },
                        pregnant: {$sum: {$cond: [{$eq:["$pregnant", true]}, 1, 0]}},
                        loctating: {$sum: {$cond: [{$eq:["$loctating", true]}, 1, 0]}},
                     }}
                    ]);
                 if(week) { 
                logger.info("Request sent back");
                res.status(201).json({ week });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "monthly"){
                const month = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {month: { $month : "$createdAt" }},
                        pregnant: {$sum: {$cond: [{$eq:["$pregnant", true]}, 1, 0]}},
                        loctating: {$sum: {$cond: [{$eq:["$loctating", true]}, 1, 0]}},
                    }}
                            ]);
                 if(month) { 
                logger.info("Request sent back");
                res.status(201).json({ month });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "yearly"){
                const year = await Animal.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {year: { $year : "$createdAt" }},
                        pregnant: {$sum: {$cond: [{$eq:["$pregnant", true]}, 1, 0]}},
                        loctating: {$sum: {$cond: [{$eq:["$loctating", true]}, 1, 0]}},
                    }}
                ]);
                 if(year) { 
                logger.info("Request sent back");
                res.status(201).json({ year });
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
                
                const today = await HealthRecord.find({userId, date : now } , "animal price" );
                
                if(today) { 
                logger.info("Request sent back");
                res.status(201).json({ today });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "daily"){

                
                const daily = await HealthRecord.find(
                    {
                        
                        "date": 
                        {
                            $gte: new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))
                        }
                    }, "animal price"
                    ).sort({ "date": -1 })

                 if(daily) { 
                    
                logger.info("Request sent back");
                res.status(201).json({ daily  });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "weekly"){
                const week = await HealthRecord.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {
                        $unwind: "$animal"
                    },
                    {$group: {
                        _id : {week: { $week : "$createdAt" } },
                        price: {$sum:  "$price"},
                        count: { $sum: 1 }

                     }}
                    ]);
                 if(week) { 
                logger.info("Request sent back");
                res.status(201).json({ week });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "monthly"){
                const month = await HealthRecord.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {
                        $unwind: "$animal"
                    },
                    {$group: {
                        _id : {month: { $month : "$createdAt" }},
                        price: {$sum:  "$price"},
                        count: { $sum: 1 }
                    }},
                   
                    
                            ]);
                 if(month) { 
                logger.info("Request sent back");
                res.status(201).json({ month });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "yearly"){
                const year = await HealthRecord.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {
                        $unwind: "$animal"
                    },
                    {$group: {
                        _id : {year: { $year : "$createdAt" }},
                        price: {$sum:  "$price"},
                        count: { $sum: 1 }

                    }}
                ]);
                 if(year) { 
                logger.info("Request sent back");
                res.status(201).json({ year });
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
