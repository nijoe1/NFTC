const basePath = process.cwd();
const buildDir = `${basePath}/build`;
const imageDir = `${buildDir}` + `/`+`images`
const jsonDir = `${basePath}/build/json/`; 
const {rebuildMetadata,upload} = require(`${basePath}/src/images_NFT.js`);
const { startCreating, buildSetup} = require(`${basePath}/src/main.js`);
const layersDir = `${basePath}/layers`;
const fs = require("fs");
const config = require(`${basePath}/src/config.js`);
const dbConfig = require("../../config/db");


const saveCollection = async() => {
  console.log("Started Saving Collection")
  var MongoClient = require('mongodb').MongoClient;
  var url = dbConfig.url + dbConfig.database

  await sleep(3600)
  function sleep(ms) {
    return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbConfig.database);

    dbo.collection("collections").deleteMany({}, function(err, res) {
      if (err) throw err;
      console.log("Documents Removed");
      
    });

    fs.readdir((`${imageDir}`), (err, files) => {
      files.forEach(file => {
        
        var image = { img: Buffer.from(fs.readFileSync(`${imageDir}`+ `/`+`${file}`).toString('base64'), 'base64'),
          filename: file,
          Date: Date()
          };
        dbo.collection("collections").insertOne(image, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
        });
      });
    });

  });
}


exports.generate = async(req,res) => {
  try{
    console.log("Generating....")
    await buildSetup();
    await startCreating();
    await saveCollection();
    return res.status(200).send({
      message: "Successfully Generated Collection",
    });
  }
  catch(error){
    return res.status(500).send({
      message: error.message,
    });
  }

};

exports.upload = async(req,res)=>{
    console.log("Uploading")
    console.log("Images are uploading")
    var uploadResult = await upload(imageDir)
    console.log(uploadResult)
    await rebuildMetadata(uploadResult.cid)
    var jsonUploadResult = await upload(jsonDir)
    console.log(jsonUploadResult)

    var MongoClient = require('mongodb').MongoClient;
    var url = dbConfig.url + dbConfig.database
  
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbConfig.database);

      dbo.collection("collectionURI").deleteMany({ } , function(err, res) {
        if (err) throw err;
        console.log("docs removed");

    });
      dbo.collection("collectionURI").insertOne(jsonUploadResult, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();

    });
    });
};

exports.layers = (data) => {
  return new Promise((resolve,reject) =>{
    console.log(data)
    console.log("Generating layers")
    console.log(data)
    return data
  }); 
};


exports.rebuildImageData = (imageData, res) => {

  console.log(imageData)
  fs.readdirSync((`${layersDir}`+`/`+`${imageData.title}`), (err, files) => {

    files.forEach(file => {
      if(file.startsWith(imageData.imageName)){
        var rarityDelimiter = config.rarityDelimiter
        var pathToFile = layersDir+"/"+imageData.title+"/"
        fs.rename(`${pathToFile}`+`${file}`,
         `${pathToFile}`+
         `${imageData.imageName}`+`${rarityDelimiter}`+`${imageData.rarity}`+`${file.substr(file.length - 4)}`, function(err) {
          if ( err ) console.log('ERROR: ' + err);
      });
      }
    });
  });
   
};




