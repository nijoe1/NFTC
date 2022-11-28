const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/db");

var storage = new GridFsStorage({
    
    url: dbConfig.url + dbConfig.database,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];
        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${file.originalname}`;
            return filename;
        }
        return {
            bucketName: dbConfig.imgBucket,
            filename: `${file.originalname}`,
            metadata: {
                collection: req.body.collection,
                layer: req.body.layer
            }
        };
    }
});

// Single File Upload
// var uploadFiles = multer({ storage: storage }).single("file");

// var uploadFiles = multer({ storage: storage }).array("file", 25);

var uploadFiles = multer({ storage: storage }).fields(
    [
        {
            name: 'file',
            maxCount: 25
        },
        {
            name: 'collection', maxCount: 1
        },
        {
            name: 'layer', maxCount: 1
        }
    ]
);

var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;

