const {images} = require("./imageData");
const Category = require("../models/Category");

const names = [
    "PAN PARAG PAN MASALA",
    "PAN MASALA (RMD) PACK OF 60 EACH",
    "INDIAN TOBACCO PROD.PAN MASALA CONTG",
    "PAN MASALA CONTAINING TOBACCO RMD GUTKHA4 GMS",
    "PAN MASALA - INCLUDED SCENTED SUPARI MOUTH FRESHNER",
    "RAJNIGANDHA PAN MASALA -100GM TIN",
    "INDIAN TOBACCO PROD.PAN MASALA CONTG",
    "PAN MASALA( API )",
    "INDIAN TOBACCO PROD.PAN MASALA CONTG",
    "PAN MASALA CONTAINING TOBACCO RMD",
    "INDIAN TOBACCO PROD.PAN MASALA CONTG",
    "MANOJ HEERA PANNA PAN MASALA POWDER 100GMS",
    "PAN MASALA - HEERA PANNA 500 GMS",
    "MANOJ HEERA PANNA PAN MASALA POWDER 500GMS"
]

module.exports.products = [
    {
        productImages:[
            images[Math.round(Math.random()*images.length - 1)],
            images[Math.round(Math.random()*images.length - 1)],
        ],
        categoryId: "dsdsds",
        productName: names[Math.round(Math.random()*names.length - 1)],
        productPrice: Math.round(Math.random()* 250),
        active: true
    }, {
        productImages:[
            images[Math.round(Math.random()*images.length - 1)],
            images[Math.round(Math.random()*images.length - 1)],
        ],
        categoryId: "dsdsds",
        productName: names[Math.round(Math.random()*names.length - 1)],
        productPrice: Math.round(Math.random()* 250),
        active: true
    }, {
        productImages:[
            images[Math.round(Math.random()*images.length - 1)],
            images[Math.round(Math.random()*images.length - 1)],
        ],
        categoryId: "dsdsds",
        productName: names[Math.round(Math.random()*names.length - 1)],
        productPrice: Math.round(Math.random()* 250),
        active: true
    }, {
        productImages:[
            images[Math.round(Math.random()*images.length - 1)],
            images[Math.round(Math.random()*images.length - 1)],
        ],
        categoryId: "dsdsds",
        productName: names[Math.round(Math.random()*names.length - 1)],
        productPrice: Math.round(Math.random()* 250),
        active: true
    }, {
        productImages:[
            images[Math.round(Math.random()*images.length - 1)],
            images[Math.round(Math.random()*images.length - 1)],
        ],
        categoryId: "dsdsds",
        productName: names[Math.round(Math.random()*names.length - 1)],
        productPrice: Math.round(Math.random()* 250),
        active: true
    }, {
        productImages:[
            images[Math.round(Math.random()*images.length - 1)],
            images[Math.round(Math.random()*images.length - 1)],
        ],
        categoryId: "dsdsds",
        productName: names[Math.round(Math.random()*names.length - 1)],
        productPrice: Math.round(Math.random()* 250),
        active: true
    }, {
        productImages:[
            images[Math.round(Math.random()*images.length - 1)],
            images[Math.round(Math.random()*images.length - 1)],
        ],
        categoryId: "dsdsds",
        productName: names[Math.round(Math.random()*names.length - 1)],
        productPrice: Math.round(Math.random()* 250),
        active: true
    }, {
        productImages:[
            images[Math.round(Math.random()*images.length - 1)],
            images[Math.round(Math.random()*images.length - 1)],
        ],
        categoryId: "dsdsds",
        productName: names[Math.round(Math.random()*names.length - 1)],
        productPrice: Math.round(Math.random()* 250),
        active: true
    }, {
        productImages:[
            images[Math.round(Math.random()*images.length - 1)],
            images[Math.round(Math.random()*images.length - 1)],
        ],
        categoryId: "dsdsds",
        productName: names[Math.round(Math.random()*names.length - 1)],
        productPrice: Math.round(Math.random()* 250),
        active: true
    }, {
        productImages:[
            images[Math.round(Math.random()*images.length - 1)],
            images[Math.round(Math.random()*images.length - 1)],
        ],
        categoryId: "dsdsds",
        productName: names[Math.round(Math.random()*names.length - 1)],
        productPrice: Math.round(Math.random()* 250),
        active: true
    }, {
        productImages:[
            images[Math.round(Math.random()*images.length - 1)],
            images[Math.round(Math.random()*images.length - 1)],
        ],
        categoryId: "dsdsds",
        productName: names[Math.round(Math.random()*names.length - 1)],
        productPrice: Math.round(Math.random()* 250),
        active: true
    }, {
        productImages:[
            images[Math.round(Math.random()*images.length - 1)],
            images[Math.round(Math.random()*images.length - 1)],
        ],
        categoryId: "dsdsds",
        productName: names[Math.round(Math.random()*names.length - 1)],
        productPrice: Math.round(Math.random()* 250),
        active: true
    }, {
        productImages:[
            images[Math.round(Math.random()*images.length - 1)],
            images[Math.round(Math.random()*images.length - 1)],
        ],
        categoryId: "dsdsds",
        productName: names[Math.round(Math.random()*names.length - 1)],
        productPrice: Math.round(Math.random()* 250),
        active: true
    }, 
]; 