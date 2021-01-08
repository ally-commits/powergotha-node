const MilkReport = require("../../models/MilkReport");  
const { query,body, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
const mongoose = require("mongoose");
var moment = require('moment'); 


module.exports.totalMilkProduction = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),
    query('time').not().isEmpty().withMessage("time parameter is required"),

    async (req, res) => {
        const userId = req.user._id;
       
        let filter = req.query.filter;
        let time = req.query.time;

        try {   

            if(filter === "today"){
                
               
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        "time" : {$eq : time}
                    }},
                    {$group: {
                        _id : {key : "$date",time : "$time"},
                        time : {$sum : "$time"},
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
                        "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))},
                        "time" : {$eq : time}
                    }},
                    {$group: {
                        _id : {key : "$date", time : "$time"},
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
                        "time" : {$eq : time}
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
                        "time" : {$eq : time}
                    }},
                    {$group: {
                        _id : {key: { $month : "$date" },time : "$time"},
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
                        "time" : {$eq : time}
                    }},
                    {$group: {
                        _id : {key: { $year : "$date" },time : "$time"},
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
               
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {time : "$time"},
                        fat : {$avg : "$fat"},
                     }}

                     
                ])

                
                const data2 = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        fat : {$avg : "$fat"},
                     }}

                     
                ])

                
                 if(data && data2) { 
                logger.info("Request sent back");
                res.status(201).json({ data,data2 });
            } else { 
                throw Error("Report Not Found");
            }
            }

            if(filter === "daily"){
                
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {time : "$time"},
                        fat : {$avg : "$fat"},
                    }}
                ]).sort({ "date": -1 });
            
                const data2 = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        fat : {$avg : "$fat"},
                    }}
                ]).sort({ "date": -1 });
            
                 if(data && data2) { 
                logger.info("Request sent back");
                res.status(201).json({ data, data2 });
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
                        _id : {time : "$time"},
                        fat : {$avg : "$fat"},
                     }}
                    ]);

                const data2 = await MilkReport.aggregate([
                        {$match: {
                            "userId": new mongoose.Types.ObjectId(userId),
                        }},
                        {$group: {
                            _id : {key: { $week : "$date" }},
                            fat : {$avg : "$fat"},
                         }}
                        ]);
                 if(data && data2) { 
                logger.info("Request sent back");
                res.status(201).json({ data, data2 });
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
                        _id : {time : "$time"},
                        fat : {$avg : "$fat"}
                                }}
                            ]);
                const data2 = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $month : "$date" }},
                        fat : {$avg : "$fat"}
                    }}
                    ]);
                 if(data && data2) { 
                logger.info("Request sent back");
                res.status(201).json({ data, data2 });
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
                        _id : {time : "$time"},
                        fat : {$avg : "$fat"}
                                }}
                            ]);
                const data2 = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $year : "$date" }},
                        fat : {$avg : "$fat"}
                    }}
                ]);
                 if(data && data2) { 
                logger.info("Request sent back");
                res.status(201).json({ data, data2 });
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
               
                const data = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {time : "$time"},
                        SNF : {$avg : "$SNF"},
                    }}
                ])

                const data2 = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        SNF : {$avg : "$SNF"},
                    }}
                ])
                 if(data && data2) { 
                logger.info("Request sent back");
                res.status(201).json({ data, data2 });
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
                        _id : {time : "$time"},
                        SNF : {$avg : "$SNF"},
                     }}
                ]).sort({ "date": -1 });
            
                const data2 = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))}
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        SNF : {$avg : "$SNF"},
                     }}
                ]).sort({ "date": -1 });
                 if(data && data2) { 
                logger.info("Request sent back");
                res.status(201).json({ data, data2 });
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
                        _id : {time : "$time"},
                        SNF : {$avg : "$SNF"},
                     }}
                    ]);

                const data2 = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $week : "$date" }},
                        SNF : {$avg : "$SNF"},
                     }}
                ]);
                 if(data && data2) { 
                logger.info("Request sent back");
                res.status(201).json({ data, data2 });
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
                        _id : {time : "$time"},
                        SNF : {$avg : "$SNF"}
                                }}
                            ]);

                const data2 = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $month : "$date" }},
                            SNF : {$avg : "$SNF"}
                    }}
                ]);
                 if(data && data2) { 
                logger.info("Request sent back");
                res.status(201).json({ data, data2 });
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
                        _id : {time : "$time"},
                        SNF : {$avg : "$SNF"}
                                }}
                            ]);

                const data2 = await MilkReport.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                    }},
                    {$group: {
                        _id : {key: { $year : "$date" }},
                        SNF : {$avg : "$SNF"}
                    }}
                ]);
                 if(data && data2) { 
                logger.info("Request sent back");
                res.status(201).json({ data, data2 });
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