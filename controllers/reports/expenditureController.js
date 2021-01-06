const AnimalFeed = require("../../models/AnimalFeed"); 
const { body,query, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
const mongoose = require("mongoose");
var moment = require('moment'); 


module.exports.getAllExpenditure = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),
    query('feedType').not().isEmpty().withMessage("feed Type parameter is required"),


    async (req, res) => {
        const userId = req.user._id;
        const feedType = req.query.feedType;
        let filter = req.query.filter;

        try {   

            if(filter === "today"){
                var now = moment().format('YYYY-MM-DD');
                const expToday = await AnimalFeed.find({userId, feedType, date: now} , "feedType price quantity" );
                
                if(expToday) { 
                logger.info("Request sent back");
                res.status(201).json({ expToday });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "daily"){
                const expDaily = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "feedType": feedType,
                    }},
                    {$group: {
                        _id : {date: "$date"},
                        price1 : {$sum : "$price"},
                        quantity1 : {$sum : "$quantity"},
                     }},
                     {$project: {
                        
                        total : {$multiply : ["$price1", "$quantity1"]},
                     }}
                    ]);
                 if(expDaily) { 
                logger.info("Request sent back");
                res.status(201).json({ expDaily });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "weekly"){
                const expWeek = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "feedType": feedType,
                    }},
                    {$group: {
                        _id : {week: { $week : "$date" }},
                        price1 : {$sum : "$price"},
                        quantity1 : {$sum : "$quantity"},
                     }},
                     {$project: {
                        total : {$multiply : ["$price1", "$quantity1"]},
                     }}
                    ]);
                 if(expWeek) { 
                logger.info("Request sent back");
                res.status(201).json({ expWeek });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "monthly"){
                const expMonth = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "feedType": feedType,
                    }},
                    {$group: {
                        _id : {month: { $month : "$date" }},
                        price1 : {$sum : "$price"},
                        quantity1 : {$sum : "$quantity"},

                    }},
                    {$project: {
                        
                        total : {$multiply : ["$price1", "$quantity1"]},
                     }}
                            ]);
                 if(expMonth) { 
                logger.info("Request sent back");
                res.status(201).json({ expMonth });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "yearly"){
                const expYear = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "feedType": feedType,
                    }},
                    {$group: {
                        _id : {year: { $year : "$date" }},
                        price1 : {$sum : "$price"},
                        quantity1 : {$sum : "$quantity"},

                    }},
                    {$project: {
                        
                        total : {$multiply : ["$price1", "$quantity1"]},
                     }}
                ]);
                 if(expYear) { 
                logger.info("Request sent back");
                res.status(201).json({ expYear });
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
