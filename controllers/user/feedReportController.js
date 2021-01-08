const AnimalFeed = require("../../models/AnimalFeed");  
const { query,body, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
const mongoose = require("mongoose");


module.exports.getFeedReport = [
    query('date').not().isEmpty().withMessage("date parameter is required"), 

    async (req, res) => {
        const userId = req.user._id;
        let date = req.query.date; 
        try {   
            const report = await AnimalFeed.find({userId,date:  {"$gte": new Date(date),"$lte": new Date(date)} });

            if(report) { 
                logger.info("Request sent back");
                res.status(201).json({ report});
            } else { 
                throw Error("Report Not Found");
            }
        }
        catch(err) { 
            logger.error(err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    } 
]

module.exports.addFeedReport = [ 
    body('date').not().isEmpty().withMessage("date Feild is required"),   
    body('feedType').not().isEmpty().withMessage("feedType Feild is required"),   
    body('feedName').not().isEmpty().withMessage("feedName Feild is required"),   
    body('quantity').not().isEmpty().withMessage("quantity Feild is required"),   
    body('price').not().isEmpty().withMessage("price Feild is required"),      
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        const userId = req.user._id;
        let {date, feedType, feedName, quantity, price} = req.body;
         
        try { 
            const report = await AnimalFeed.create({date, feedType, feedName, quantity, price,userId}); 
            if(report) {  
                res.status(201).json({ message: "Report Added Successfully",report}); 
            } else 
                throw Error("Could'nt add report")
        }
        catch(err) { 
            logger.error(err)
            let error = err.message; 
            res.status(400).json({ error: error });
        }   
    } 
];


module.exports.editFeedReport = [
    body('date').not().isEmpty().withMessage("date Feild is required"),   
    body('feedType').not().isEmpty().withMessage("feedType Feild is required"),   
    body('feedName').not().isEmpty().withMessage("feedName Feild is required"),   
    body('quantity').not().isEmpty().withMessage("quantity Feild is required"),   
    body('price').not().isEmpty().withMessage("price Feild is required"),  
    body('feedReportId').not().isEmpty().withMessage("feedReportId Feild is required"),  

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user._id;
        const {date, feedType, feedName, quantity, price,feedReportId} = req.body;
        try {
            const feedR = await AnimalFeed.findByIdAndUpdate({_id: feedReportId, userId},{date, feedType, feedName, quantity, price}); 
            if(feedR) {
                const Report = await AnimalFeed.findById({_id: feedReportId, userId});
                res.status(201).json({ message: "Feed Report Updated Successfully", feedReport: Report}); 
            } else 
                throw Error("No Feed Report Found")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]




module.exports.totalFeed = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),
    query('filter2').not().isEmpty().withMessage("filter2 parameter is required"),

    async (req, res) => {
        const userId = req.user._id;
        let data;
        let filter = req.query.filter;
        let filter2 = req.query.filter2;

        try {   

            if(filter === "today"){
                
               if(filter2 === "AGGREGATE"){
                 data = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key : "$date",feedType : "$feedType" },
                        quantity : {$sum : "$quantity"},
                        price : {$sum : "$price"},

                     }},
                     {$project: {
                        quantity :  "$quantity",
                        price : "$price",
                     }}
                ])
             }else if(filter2 === "AVERAGE"){

                 data = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key : "$date",feedType : "$feedType" },
                        quantity : {$avg : "$quantity"},
                        price : {$avg : "$price"},

                     }},
                     {$project: {
                        quantity :  "$quantity",
                        price : "$price",
                     }}
                ])
             }else{
                throw Error("Wrong Filter");

             }    
                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "daily"){
                
                if(filter2 === "AGGREGATE"){
                     data = await AnimalFeed.aggregate([
                        {$match: {
                            "userId": new mongoose.Types.ObjectId(userId),
                            "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))},
                        }},
                        {$group: {
                            _id : {key : "$date",feedType : "$feedType" },
                            quantity : {$sum : "$quantity"},
                            price : {$sum : "$price"},
    
                         }},
                         {$project: {
                            quantity :  "$quantity",
                            price : "$price",
                         }}
                    ]).sort({ "date": -1 });
                    
                }else if(filter2 === "AVERAGE"){
                     data = await AnimalFeed.aggregate([
                        {$match: {
                            "userId": new mongoose.Types.ObjectId(userId),
                            "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))},
                            
                        }},
                        {$group: {
                            _id : {key : "$date",feedType : "$feedType" },
                            quantity : {$avg : "$quantity"},
                            price : {$avg : "$price"},
    
                         }},
                         {$project: {
                            quantity :  "$quantity",
                            price : "$price",
                         }}
                    ]).sort({ "date": -1 });
                }else{
                    throw Error("Wrong Filter");
    
                } 

                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "weekly"){
                  
               if(filter2 === "AGGREGATE"){
                 data = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        
                    }},
                    {$group: {
                        _id : {key: { $week : "$date" },feedType : "$feedType" },
                        quantity : {$sum : "$quantity"},
                        price : {$sum : "$price"},

                     }},
                     {$project: {
                        quantity :  "$quantity",
                        price : "$price",
                     }}
                ])
            }else if(filter2 === "AVERAGE"){
                 data = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key: { $week : "$date" },feedType : "$feedType" },
                        quantity : {$avg : "$quantity"},
                        price : {$avg : "$price"},

                     }},
                     {$project: {
                        quantity :  "$quantity",
                        price : "$price",
                     }}
                ])
            }else{
                throw Error("Wrong Filter");

            } 

                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
            } else { 
                throw Error("Report Not Found");
            }
            }

            if(filter === "monthly"){
               
                  
               if(filter2 === "AGGREGATE"){
                 data = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        
                    }},
                    {$group: {
                        _id : {key: { $month : "$date" },feedType : "$feedType" },
                        quantity : {$sum : "$quantity"},
                        price : {$sum : "$price"},

                     }},
                     {$project: {
                        quantity :  "$quantity",
                        price : "$price",
                     }}
                ])
            }else if(filter2 === "AVERAGE"){
                 data = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key: { $month : "$date" },feedType : "$feedType" },
                        quantity : {$avg : "$quantity"},
                        price : {$avg : "$price"},

                     }},
                     {$project: {
                        quantity :  "$quantity",
                        price : "$price",
                     }}
                ])
            }else{
                throw Error("Wrong Filter");

            } 


                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
            } else { 
                throw Error("Report Not Found");
            }
            }

            if(filter === "yearly"){
                
                  
               if(filter2 === "AGGREGATE"){
                 data = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),

                    }},
                    {$group: {
                        _id : {key: { $year : "$date" },feedType : "$feedType" },
                        quantity : {$sum : "$quantity"},
                        price : {$sum : "$price"},

                     }},
                     {$project: {
                        quantity :  "$quantity",
                        price : "$price",
                     }}
                ])
            }else if(filter2 === "AVERAGE"){
                
                data = await AnimalFeed.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key: { $year : "$date" },feedType : "$feedType" },
                        quantity : {$avg : "$quantity"},
                        price : {$avg : "$price"},

                     }},
                     {$project: {
                        quantity :  "$quantity",
                        price : "$price",
                     }}
                ])
            }else{
                throw Error("Wrong Filter");

            }

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
