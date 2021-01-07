const AnimalFeed = require("../../models/AnimalFeed"); 
const { body,query, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
const mongoose = require("mongoose");
var moment = require('moment'); 


module.exports.getAllFeed = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),
    query('feedType').not().isEmpty().withMessage("feed Type parameter is required"),


    async (req, res) => {
        const userId = req.user._id;
        const feedType = req.query.feedType;
        let filter = req.query.filter;

        try {   

            if(filter === "today"){
                var now = moment().format('YYYY-MM-DD');
               
                const data = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        price1 : {$sum : "$price"},
                        quantity1 : {$sum : "$quantity"},
                     }},
                     {$project: {
                        
                        total : {$multiply : ["$price1", "$quantity1"]},
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
                const data = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        price1 : {$sum : "$price"},
                        quantity1 : {$sum : "$quantity"},
                     }},
                     {$project: {
                        
                        total : {$multiply : ["$price1", "$quantity1"]},
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
                const data = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "feedType": feedType,
                    }},
                    {$group: {
                        _id : {key: { $week : "$date" }},
                        price1 : {$sum : "$price"},
                        quantity1 : {$sum : "$quantity"},
                     }},
                     {$project: {
                        total : {$multiply : ["$price1", "$quantity1"]},
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
                const data = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "feedType": feedType,
                    }},
                    {$group: {
                        _id : {key: { $month : "$date" }},
                        price1 : {$sum : "$price"},
                        quantity1 : {$sum : "$quantity"},

                    }},
                    {$project: {
                        
                        total : {$multiply : ["$price1", "$quantity1"]},
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
                const data = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "feedType": feedType,
                    }},
                    {$group: {
                        _id : {key: { $year : "$date" }},
                        price1 : {$sum : "$price"},
                        quantity1 : {$sum : "$quantity"},

                    }},
                    {$project: {
                        
                        total : {$multiply : ["$price1", "$quantity1"]},
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
