const sql = require("mssql");
const router = require('express').Router();
const fs = require("fs");
const configs = require('../../config');
const multer = require('multer');
const { request } = require("express");
const storage = 'uploads/';
const upload = multer({ dest: storage, limits: { fileSize: 100000 } });
const path = require('path');


router.get("/:siteid/:id", function (request, response) {
    const siteid = request.params.siteid
    const id = request.params.id;
    const blankImageFilePath = 'gallery/blank_image.jpg';
    const filePath = 'gallery/' + siteid + '/' + id;

    //console.log({GetOneiMAGE: request.params});

    fs.exists(filePath, function (exists) {
        console.log({filePath: filePath, exists: exists, params: request.params, url: request.originalUrl});

        if (!exists) {
            response.writeHead(200, {
                "Content-Type": 'image/jpg'
            });
            fs.readFile(blankImageFilePath,
                function (err, content) {
                    response.end(content);
                });
        }
        else {
            const fileExtension = path.extname(filePath);
            let contentType = 'image/png';
            if (fileExtension === ".png") {
                contentType = "image/png";
            }
            else if (fileExtension === ".jpg") {
                contentType = "image/jpeg";
            }
            else if (fileExtension === ".jpeg") {
                contentType = "image/jpeg";
            }
            const payload = {
                siteid: siteid, id: id, filePath: filePath, 
                fileExtension: fileExtension, contentType: contentType,
                params: request.params
            };
            //console.log(payload);

            // Setting the headers
            response.writeHead(200, {
                "Content-Type": contentType
            });
            // Reading the file
            fs.readFile(filePath,
                function (err, content) {
                    // Serving the image
                    response.end(content);
                });

        }

    });

});

module.exports = router;