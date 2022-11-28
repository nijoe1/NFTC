
const generationControler = require('../generation/controllers/generation.controller');
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");


exports.routesConfig = function (app) {
    app.get('/generate', [
        generationControler.generate
    ]);
    app.post('/layers',(req,res) =>{
        generationControler.layers(req.body)
    });
    app.get('/uploadCollection', [
        generationControler.upload
    ]);

    app.get('/', [
        homeController.getHome
    ]);

    app.post('/upload', [
        uploadController.uploadFiles
    ]);

    app.post('/contract', [
        uploadController.uploadContract
    ]);


    app.get('/upload/collection', [
        generationControler.saveCollection
    ]);

    app.get('/contracts', [
        uploadController.getListContracts
    ]);

    app.get('/files', [
        uploadController.getListFiles
    ]);

    app.get('/collections', [
        uploadController.getListCollections
    ]);

    app.get('/collectionURL', [
        generationControler.getCollection
    ]);

    app.get('/build/files', [
        uploadController.buildLayerImages
    ]);

    app.get('/files/:name', [
        uploadController.download
    ]);

    app.get('/collections/:name', [
        uploadController.downloadCollection
    ]);
};
