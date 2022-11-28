const generationModel = require('../models/generation.model');
const dbConfig = require("../../config/db");
const basePath = process.cwd();
const MongoClient = require("mongodb").MongoClient;
const url = dbConfig.url;
const mongoClient = new MongoClient(url);

const valueOf = (data) => {

    return data;
};

exports.generate = async(req, res) => {
    try{
        console.log("Controller starts Generation")
        return generationModel.generate(req,res)
    }
    catch(error){
       return res.status(500).send({
            message: error.message,
          });
    }
 
};

exports.saveCollection = async(req, res) => {
    try{
        return generationModel.saveCollection(req,res)
    }
    catch(error){
       return res.status(500).send({
            message: error.message,
          });
    }
 
};

exports.getCollection = async(req,res) =>{
    try{
        await mongoClient.connect();
        const database = mongoClient.db(dbConfig.database);
        const collection = database.collection("collectionURI");
        const cursor = collection.find({});
        if ((await cursor.count()) === 0) {
          return res.status(500).send({
            message: "No files found!",
          });
        }
        let fileInfos = []
        await cursor.forEach((doc) => {
          fileInfos.push({
            cid: doc.cid
          });
        });
        return res.status(200).send(fileInfos);
    }
    catch(err){
        console.log(err.message)
        return res.status(500).send({
            message : err.message
        })
    }

}

exports.upload = (req, res) => {
    console.log("Controller starts Uploading")
    result = generationModel.upload(req.body)
    return res.status(200).send(result) 
};

exports.layers = (req, res) => {
    var layers = [];
    var layerData = []
    req.layers.forEach(function(data) {
        var layer = {}
        layer.name = data.layer.title
        layer.pos = data.layer.position
        layers.push(layer)
        data.layer.images.forEach(function(image){
            var imageData = {}
            imageData.title = data.layer.title
            imageData.imageName = image.image.name
            imageData.rarity = image.image.rarity
            layerData.push(valueOf(imageData))
        });
    });

    layers.sort((a, b) => {
        return a.pos - b.pos;
    });

    var json = JSON.stringify(layers);
    var layersJson = JSON.stringify(layerData);
    var fs = require('fs');
    

    fs.writeFile(`${basePath}/layers/myjsonfile.json`, json, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });

      fs.writeFile(`${basePath}/layers/layersData.json`, layersJson, (err) => {
        if (err) throw err;
        console.log('The Layers Data file has been saved!');
      });

      

    console.log("Controller gets Layers info")
    console.log(layers)
    generationModel.layers(req.body)
};
