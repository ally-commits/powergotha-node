const MilkReport = require("../../models/MilkReport");  
const { query,body, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
const mongoose = require("mongoose");
var moment = require('moment'); 


module.exports.totalMilkProduction = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),

    async (req, res) => {
        const userId = req.user._id;
       
        let filter = req.query.filter;

        try {   

            if(filter === "today"){
                var now = moment().format('YYYY-MM-DD');

                const today = await MilkReport.find({userId, date : now} , "date milkInLiters" );
                 if(today) { 
                logger.info("Request sent back");
                res.status(201).json({ today });
            } else { 
                throw Error("Report Not Found");
            }
            }

            if(filter === "daily"){
                const daily = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {date: "$date",time : "$time"},
                        milkInLiters : {$sum : "$milkInLiters"},
                     }}
                    ]);
                 if(daily) { 
                logger.info("Request sent back");
                res.status(201).json({ daily });
            } else { 
                throw Error("Report Not Found");
            }
            }

            if(filter === "weekly"){
                const week = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {week: { $week : "$date" },time : "$time"},
                        milkInLiters : {$sum : "$milkInLiters"},
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
                const month = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {month: { $month : "$date" }},
                        milkInLiters : {$sum : "$milkInLiters"}
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
                const year = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {year: { $year : "$date" }},
                        milkInLiters : {$sum : "$milkInLiters"}
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



module.exports.averageFat = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),

    async (req, res) => {
        const userId = req.user._id;
        let filter = req.query.filter;

        try {   

            if(filter === "today"){
                var now = moment().format('YYYY-MM-DD');
                const today = await MilkReport.find({userId, date: now} , "date time fat" );
                 if(today) { 
                logger.info("Request sent back");
                res.status(201).json({ today });
            } else { 
                throw Error("Report Not Found");
            }
            }

            if(filter === "daily"){
                const daily = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {date: "$date",time : "$time"},
                        fat : {$avg : "$fat"},
                     }}
                    ]);
                 if(daily) { 
                logger.info("Request sent back");
                res.status(201).json({ daily });
            } else { 
                throw Error("Report Not Found");
            }
            }

            if(filter === "weekly"){
                const week = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {week: { $week : "$date" },time : "$time"},
                        fat : {$avg : "$fat"},
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
                const month = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {month: { $month : "$date" },time : "$time"},
                        fat : {$avg : "$fat"}
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
                const year = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {year: { $year : "$date" },time : "$time"},
                        fat : {$avg : "$fat"}
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



module.exports.averageSnf = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),

    async (req, res) => {
        const userId = req.user._id;
        let filter = req.query.filter;

        try {   

            if(filter === "today"){
                var now = moment().format('YYYY-MM-DD');
                const today = await MilkReport.find({userId, date : now} , "date time SNF" );
                 if(today) { 
                logger.info("Request sent back");
                res.status(201).json({ today });
            } else { 
                throw Error("Report Not Found");
            }
            }

            if(filter === "daily"){
                const daily = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {date: "$date",time : "$time"},
                        SNF : {$avg : "$SNF"},
                     }}
                    ]);
                 if(daily) { 
                logger.info("Request sent back");
                res.status(201).json({ daily });
            } else { 
                throw Error("Report Not Found");
            }
            }

            if(filter === "weekly"){
                const week = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {week: { $week : "$date" },time : "$time"},
                        SNF : {$avg : "$SNF"},
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
                const month = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {month: { $month : "$date" },time : "$time"},
                        SNF : {$avg : "$SNF"}
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
                const year = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {year: { $year : "$date" },time : "$time"},
                        SNF : {$avg : "$SNF"}
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
