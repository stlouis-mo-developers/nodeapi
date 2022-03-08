const sql = require("mssql");
const router = require('express').Router();
const fs = require("fs");
const configs = require('../../config');
const multer = require('multer');
const { request } = require("express");
const storage = 'uploads/';
const upload = multer({ dest: storage, limits: { fileSize: 100000 } });
const path = require('path');
const authorize = require('../authentication/authorize');


//  http://localhost:3010/api/gallery/FEA91F56-CBE3-4138-8BB6-62F9A5808D57/1
//  https://nodeapi.launchfeatures.com/api/gallery/88B8B45E-2BE7-44CB-BBEA-547BB9A8C7D5/2
router.get("/:siteid/:pagenum?", function (request, response) {
    //console.log({ GetAll: request.params });

    const siteid = request.params.siteid
    const config = configs.find(c => c.privateKeyID === siteid);
    const payload = {
        headers: request.headers, body: request.body, params: request.params, queryString: request.query
    };
    ListAll(config, response, payload, siteid).then((data) => {
        //console.log({ ListAll_Success: data });
        return response.send(data);
    }).catch((error) => {
        console.log({ ListAll_Error: error });
        return response.send([]);
    });

});


router.post("/:siteid", upload.single('file'), async (request, response) => {
    try {
        const siteid = request.params.siteid || request.headers['pin'];
        const params = request.params;
        const headers = request.headers;
        const body = request.body;
        const queryString = request.query;
        const file = request.file;
        const directories = ['gallery', 'uploads'];
        const config = configs.find(c => c.privateKeyID === siteid);
        const authentication = await authorize.getAuthentication(config, headers.authid, headers.userid, headers.websiteid);

        if (authentication.recordset && authentication.recordset.length > 0) {

            if (directories && directories.length > 0) {
                for (let d = 0; d < directories.length; d++) {
                    const dir = directories[d];
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }
                }
            }

            if (!fs.existsSync('gallery' + '/' + params.siteid)) {
                fs.mkdirSync('gallery' + '/' + params.siteid);
            }

            const image = request.file;
            const fileName = image ? (image.filename + '-' + image.originalname) : null;
            if (!image || !fileName)
                return response.status(200).send({ message: '*image required!' });

            const fileExtension = fileName.substr(fileName.lastIndexOf('.') + 1);
            const slugifiedFileName = Slugify(fileName.replace(('.' + fileExtension), '')) + '.' + fileExtension;
            const oldPath = 'uploads' + '/' + image.filename;
            const newPath = 'gallery/' + params.siteid + '/' + slugifiedFileName;
            const publishUrl = ('https://nodeapi.launchfeatures.com/api/' + newPath).replace('gallery', 'image');

            await fs.rename(oldPath, newPath, function (err) {
                if (err) return response.status(403).send({ message: err.toString() });
                //console.log('Successfully renamed ' + oldPath);
            })


            const payload = {
                Name: (body.Name || image.originalname), Description: (body.Description || newPath),
                FileGroup: siteid, Title: image.filename + '-' + image.originalname,
                EntityTypeKeyID: siteid,
                PublishUrl: publishUrl, SourceUrl: newPath,
                Image: image,
                Category: (body.Category || 'Gallery'), Tags: (body.Tags || ''),
                ITCC_UserID: headers.userid, ITCC_WebsiteID: headers.websiteid, FilePath: newPath,
                headers: headers, body: body, params: params, queryString: queryString
            };

            const config = configs.find(c => c.privateKeyID === siteid);
            //console.log({payload: payload});
            //response.send(' ok ...');
            return CreateOrUpdateImage(config, response, payload, siteid);
            //const result = authorize.getAuthentication(config, headers.authid, headers.userid, headers.websiteid);
        }
        else{
            return response.status(200).send({ message: '*file system is full, contact system admin' });
        }
    }
    catch (err) {
       // console.log({ message: err.toString() });
        return response.status(200).send({ message: 'contact system admin' });
    }
});


function CreateOrUpdateImage(config, response, payload, privateKeyID) {
    let item = null;
    let timeDiff = null;
    let authId = null;
    let auth_item = null;
    let auth_result = null;

    //console.log({ params: params, configs: configs, config: config, privateKeyID: privateKeyID });
    return sql.connect(config, function (err) {

        if (err) {
            console.log({ post_Error1: err, config: config, privateKeyID: privateKeyID });
        }

        const params = payload.params;
        const headers = payload.headers;
        const body = payload;
        const siteid = privateKeyID; //either a value or undefined


        // create Request object
        const request = new sql.Request();
        request.input('Name', sql.NVarChar(256), payload.Name);
        request.input('Description', sql.NVarChar(), payload.Description);
        request.input('Category', sql.NVarChar(256), payload.Category);
        request.input('Tags', sql.NVarChar(), payload.Tags);
        request.input('FileGroup', sql.VarChar, payload.FileGroup);
        request.input('Title', sql.VarChar(32), payload.TName);
        request.input('UserID', sql.VarChar(), payload.ITCC_UserID);
        request.input('WebsiteID', sql.VarChar(), payload.ITCC_WebsiteID);
        request.input('ITCC_StatusID', sql.Int, 1);
        request.input('EntityTypeKeyID', sql.VarChar, payload.ITCC_WebsiteID);
        request.input('EntityTypeName', sql.VarChar(64), 'ITCC_Gallery');
        request.input('PublishUrl', sql.VarChar, payload.PublishUrl);
        request.input('SourceUrl', sql.VarChar, payload.SourceUrl);
        request.input('Date', sql.DateTime2, new Date());
        request.output('ID', sql.Int);

        let query = ' IF EXISTS(SELECT TOP 1 1 FROM ITCC_Image WHERE (ITCC_WebsiteID = @WebsiteID AND PublishUrl = @PublishUrl))  ';
        query += ' BEGIN ';
        query += ' UPDATE ITCC_Image SET Name=@Name, Description=@Description, FileGroup=@FileGroup,';
        query += ' UpdateDate = @Date, UpdateUserID = @UserID ';
        query += ' WHERE (ITCC_WebsiteID = @WebsiteID AND PublishUrl = @PublishUrl) ';
        // query += ' SELECT @ID = INSERTED.ITCC_IMAGEID FROM INSERTED';
        query += ' END ';

        query += ' ELSE ';

        query += ' BEGIN ';
        query += ' INSERT INTO ITCC_Image (Name, Description, FileGroup, ITCC_WebsiteID, CreateDate, CreateUserID, ';
        query += ' UpdateDate, UpdateUserID, IsActive, EntityTypeKeyID, EntityTypeName, Publishurl, SourceUrl, Category, Tags) ';
        query += ' VALUES (@Name, @Description, @FileGroup, @WebsiteID, @Date, @UserID, @Date, @UserID, ';
        query += ' 1, @EntityTypeKeyID, @EntityTypeName, @PublishUrl, @SourceUrl, @Category, @Tags) ';

        query += ' END ';
        query += ' SELECT TOP 1 @ID = ITCC_ImageID FROM ITCC_Image WHERE (ITCC_WebsiteID = @WebsiteID AND PublishUrl = @PublishUrl)';

        //console.log({ Pre_Success: query, payload: payload });

        asyncQuery = () => {
            return new Promise((resolve, reject) => {
                request.query(query, function (err, result) {
                    sql.close();
                    if (err) {
                        console.log({ post_Error2: err, query: query });
                        return reject(err);
                        //response.send(null);
                    }
                    else {
                        // send records as a response
                        // console.log({ recorset: (result.recordset || []), Success: query, params: params });
                        return resolve((result.recordset || []));
                        //response.send(result.recordset);
                    }
                });
            });
        };
        const result = asyncQuery();

        result.then((data) => {
            //console.log({ postData: data });
            return response.send(payload.image);
        }).catch((error) => {
            // console.log({ error1: error });
            return response.send(null);
        });

    });

}

function ListAll(config, response, payload, privateKeyID) {
    return new Promise((resolve, reject) => {
        //console.log({ params: params, configs: configs, config: config, privateKeyID: privateKeyID });
        sql.connect(config, function (err) {

            if (err) {
                console.log({ post_Error1: err, config: config, privateKeyID: privateKeyID });
                return reject(err);
            }

            const params = payload.params;
            const headers = payload.headers;
            const body = payload.body;
            const siteid = privateKeyID;
            const pageNum = (params && params.pagenum) ? Number(params.pagenum) : 1;
            const pageSize = 9;
            const offset = (pageNum > 1) ? (pageNum - 1) * pageSize : 0;

            //console.log({pageNum: pageNum, pageSize: pageSize, offset: offset})

            // create Request object
            const request = new sql.Request();
            request.input('EntityTypeName', sql.VarChar(64), 'ITCC_Gallery');

            let query = ' SELECT IM.* FROM ITCC_IMAGE IM (NOLOCK) ';
            query += ' JOIN ITCC_Website WS (NOLOCK) ON (IM.ITCC_WebsiteID = WS.ITCC_WebsiteID) ';
            query += ' WHERE (EntityTypeName = @EntityTypeName) AND (WS.PrivateKeyID = ' + "'" + siteid + "'" + ' ) ';
            query += ' ORDER BY IM.UpdateDate Desc ';
            query += ' OFFSET ' + offset + ' ROWS ';
            query += ' FETCH NEXT ' + pageSize + ' ROWS ONLY ';
            // console.log({ Pre_Success: query, payload: payload });

            request.query(query, function (err, result) {
                //sql.close();
                if (err) {
                    console.log({ post_Error2: err, query: query });
                    return reject(err);
                    //response.send(null);
                }
                else {
                    // send records as a response
                    const data = (result.recordset && result.recordset.length > 0) ? result.recordset : [];
                    // console.log({ data: data, recorset: (result.recordset || []), Success: query, params: params });
                    return resolve(data);
                    //response.send(result.recordset);
                }
            });

        });
    });
}

function Slugify(text) { // <-- removed the argument
    let str = text; // <-- added this statement
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
    return str;
};

function handleError(err, res) {
    res
        .status(500)
        .contentType("text/plain")
        .end('an error occured!');

}

module.exports = router;