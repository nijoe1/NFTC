
const basePath = process.cwd();
const layersDir = `${basePath}/layers`;
const dbConfig = require("../config/db");
const MongoClient = require("mongodb").MongoClient;
const url = dbConfig.url;
const baseUrl = "http://localhost:8080/files/";
const mongoClient = new MongoClient(url);
const fs = require("fs");

const getListFiles = async () => {
    let fileInfos = [];
    try {
      await mongoClient.connect();
      const database = mongoClient.db(dbConfig.database);
      const images = database.collection(dbConfig.imgBucket + ".files");
      const cursor = images.find({});
      if ((await cursor.count()) === 0) {
        return fileInfos
      }
      
      await cursor.forEach((doc) => {
        fileInfos.push({
          metadata: doc.metadata,
          name: doc.filename,
          url: baseUrl + doc.filename,
        });
      });
      return fileInfos
    } catch (error) {
      console.log(error.message)
      return fileInfos
    }
  };


  const buildLayerImages = async (fileInfos) => {
    try {
      var report = {}
      var message = ""
      fileInfos.forEach(function(image) {
        if (!fs.existsSync(`${layersDir}/`+`${image.metadata.layer}`)) {
          fs.mkdirSync(`${layersDir}/`+`${image.metadata.layer}`);
          message+="Created " + image.metadata.layer+ " folder in "+ layersDir
      }
    });
    report.status = "ok"
    report.message = message
      return report
    } catch (error) {
        report.status = "error"
        report.message = error.message
        return report
    }
  };
  module.exports = {
    getListFiles,
    buildLayerImages
  };