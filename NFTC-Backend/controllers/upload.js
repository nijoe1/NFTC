const upload = require("../middleware/upload");
const basePath = process.cwd();
const layersDir = `${basePath}/layers`;
const dbConfig = require("../config/db");
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const url = dbConfig.url;
const baseUrl = "http://localhost:3600/files/";
const baseCollectionUrl = "http://localhost:3600/collections/";
const mongoClient = new MongoClient(url);
const fs = require("fs");

const uploadFiles = async (req, res) => {
    try {
      console.log(req.body)
      await upload(req, res);
      console.log(req.files);
      if (req.files.length <= 0) {
        return res
          .status(400)
          .send({ message: "You must select at least 1 file." });
      }
      return res.status(200).send({
        message: "Files have been uploaded.",
      });

    } catch (error) {
      console.log(error);
      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).send({
          message: "File Limit is 25.Please reduce files sent",
        });
      }
      return res.status(500).send({
        message: `Error when trying to upload many files: ${error}`,
      });


    }
  };


  const uploadContract = async (req, res) => {
    try {
      console.log(req.body)
      console.log("Started Saving Contract")
      var MongoClient = require('mongodb').MongoClient;
      var url = dbConfig.url + dbConfig.database
  
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbConfig.database);

        var contract = {name:req.body.name, contractAddress : req.body.contractAddress , date: Date()}

        dbo.collection("contracts").insertOne(contract, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
        });
      });

      return res.status(200).send({
        message: "Successfully Saved Contract Data",
      });

    } catch (error) {
      console.log(error.message);
      return res.status(500).send({
        message: `Error when trying to upload contract: ${error}`,
      });
    }
  };


  const getListContracts = async(req, res) => {
    try {
      await mongoClient.connect();
      const database = mongoClient.db(dbConfig.database);
      const images = database.collection("contracts");
      const cursor = images.find({});
      if ((await cursor.count()) === 0) {
        return res.status(500).send({
          message: "No files found!",
        });
      }
      let fileInfos = []
      await cursor.forEach((doc) => {
        fileInfos.push({
          name: doc.name,
          addresss: doc.contractAddress,
        });
      });
      return res.status(200).send(fileInfos);
    } catch (error) {
      console.log(error.message)
      return res.status(500).send({
        message: error.message,
      });
    }
  };
    
const getListFiles = async(req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(dbConfig.database);
    const images = database.collection(dbConfig.imgBucket + ".files");
    const cursor = images.find({});
    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }
    let fileInfos = []
    await cursor.forEach((doc) => {
      fileInfos.push({
        metadata: doc.metadata,
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });
    return res.status(200).send(fileInfos);
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({
      message: error.message,
    });
  }
};

const getListCollections = async(req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(dbConfig.database);
    const images = database.collection("collections");
    const cursor = images.find({});
    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }
    let fileInfos = []
    await cursor.forEach((doc) => {
      fileInfos.push({
        metadata: doc.metadata,
        name: doc.filename,
        url: baseCollectionUrl + doc.filename,
      });
    });
    return res.status(200).send(fileInfos);
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({
      message: error.message,
    });
  }
};

const buildLayerImages = async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(dbConfig.database);
    const images = database.collection(dbConfig.imgBucket + ".files");
    const cursor = images.find({});

    if ((await cursor.count()) === 0) {
      return res.status(500).send({
        message: "No files found!",
      });
    }

    let fileInfos = []

    await cursor.forEach((doc) => {
      fileInfos.push({
        metadata: doc.metadata,
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });
    
    var message = []
    fileInfos.forEach(function(image){
      if(!fs.existsSync(`${layersDir}/`+`${image.metadata.layer}`)){
          fs.mkdirSync(`${layersDir}/`+`${image.metadata.layer}`)
          message.push("Created " + image.metadata.layer+ " folder in "+ layersDir)
      }

      const bucket = new GridFSBucket(database, {
        bucketName: dbConfig.imgBucket,
      });
      let downloadStream = bucket.openDownloadStreamByName(image.name);
      downloadStream.on("data", function (data) {
      fs.writeFile(`${layersDir}/`+`${image.metadata.layer}` +`/`+image.name, data, (err) => {
          if (err) return console.error(err)
          console.log('file saved to ', `${layersDir}/`+`${image.metadata.layer}` +`/`+image.name)
          })
        });
    });
    return res.status(200).send({
      message: message,
    });
    
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({
      message: error.message,
    });
  }


};


const download = async (req, res) => {
  try {
    await mongoClient.connect();
    const database = mongoClient.db(dbConfig.database);
    const bucket = new GridFSBucket(database, {
      bucketName: dbConfig.imgBucket,
    });
    let downloadStream = bucket.openDownloadStreamByName(req.params.name);
    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });
    downloadStream.on("error", function (err) {
      console.log(err)
      return res.status(404).send({ message: "Cannot download the Image!" });
    });
    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};


const downloadCollection = async (req, res) => {
  
    const mongodb = require('mongodb');
    const MongoClient = mongodb.MongoClient;
    var url = dbConfig.url + dbConfig.database
    MongoClient.connect(url, function(err, db){
      if (err) throw err;
      var dbo = db.db(dbConfig.database);
      dbo.collection("collections").findOne({'filename':req.params.name}, function(err, result) {
        console.log(result); //<-- Output below
        if (err) throw err;
        return res.status(200).write(result.img.buffer)
      });
    });
  }

  
module.exports = {
  uploadFiles,
  getListFiles,
  buildLayerImages,
  download,
  getListCollections,
  downloadCollection,
  uploadContract,
  getListContracts
};