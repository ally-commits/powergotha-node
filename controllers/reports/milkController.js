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
               
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        milkInLiters : {$sum : "$milkInLiters"},    
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
                
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        milkInLiters : {$sum : "$milkInLiters"},    
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
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $week : "$date" },time : "$time"},
                        milkInLiters : {$sum : "$milkInLiters"},
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
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $month : "$date" }},
                        milkInLiters : {$sum : "$milkInLiters"}
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
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $year : "$date" }},
                        milkInLiters : {$sum : "$milkInLiters"}
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



module.exports.averageFat = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),

    async (req, res) => {
        const userId = req.user._id;
        let filter = req.query.filter;

        try {   

            if(filter === "today"){
                var now = moment().format('YYYY-MM-DD');
               
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        fat : {$avg : "$fat"},
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
                
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        fat : {$avg : "$fat"},
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
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $week : "$date" },time : "$time"},
                        fat : {$avg : "$fat"},
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
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $month : "$date" },time : "$time"},
                        fat : {$avg : "$fat"}
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
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $year : "$date" },time : "$time"},
                        fat : {$avg : "$fat"}
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



module.exports.averageSnf = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),

    async (req, res) => {
        const userId = req.user._id;
        let filter = req.query.filter;

        try {   

            if(filter === "today"){
                var now = moment().format('YYYY-MM-DD');
               
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        SNF : {$avg : "$SNF"},
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
               
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        SNF : {$avg : "$SNF"},
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
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $week : "$date" },time : "$time"},
                        SNF : {$avg : "$SNF"},
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
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $month : "$date" },time : "$time"},
                        SNF : {$avg : "$SNF"}
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
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $year : "$date" },time : "$time"},
                        SNF : {$avg : "$SNF"}
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
