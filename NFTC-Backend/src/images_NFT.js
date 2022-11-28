const basePath = process.cwd();
const jsonDir = `${basePath}/build/json/`;
const { NFTStorage } = require(`${basePath}/node_modules/nft.storage`);
const { filesFromPath } = require(`${basePath}/node_modules/files-from-path`);
const fs = require("fs");
const path = require('path')
const excludeName = "_metadata.json"

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAyYTBDMUE4NjVDYUQ2QjRkNThBMmQ3ZTczM2QxQmZlODExMGI1MTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1Mzc2MzE0NjQ2NiwibmFtZSI6Im5mdHMifQ.muYCOBPi5WGkwgsQIxNe2GOSpgVxzZf_4Dv5jiEq9Dk'

const rebuildMetadata = async(uploadResult) => {
    fs.readdir(jsonDir, (err, files) => {
        files.forEach(file => {
            fs.readFile(jsonDir + file, 'utf8', function(err, data) {
                if (file != excludeName) {
                    var fileData = {}
                    fileData = JSON.parse(data);
                    var temp = fileData.image.split("/")
                    console.log("ipfs://" + uploadResult + "/" + temp[temp.length - 1])
                    fileData.image = "ipfs://" + uploadResult + "/" + temp[temp.length - 1]
                    fs.writeFile(jsonDir + file, JSON.stringify(fileData), function writeJSON(err) {
                        if (err) return console.log(err);
                        console.log(JSON.stringify(fileData));
                        console.log('writing to ' + file);
                    });
                }
            });
        });
    });
};

const upload = async(directoryPath) => {
    var cid = ""
    var response = {}
    const files = filesFromPath(directoryPath, {
        pathPrefix: path.resolve(directoryPath),
        hidden: true,
    })

    const storage = new NFTStorage({ token })

    console.log(`storing file(s) from ${path}`)
    cid = await storage.storeDirectory(files)
    console.log({ cid })

    storageStatus = await storage.status(cid)
    response.cid = cid
    response.status = storageStatus
    return response
};

module.exports = { rebuildMetadata, upload };