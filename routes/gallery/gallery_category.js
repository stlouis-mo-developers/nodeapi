const sql = require("mssql");
const router = require('express').Router();
const fs = require("fs");
const configs = require('../../config');
const { request } = require("express");
const path = require('path');

//  
//  https://nodeapi.launchfeatures.com/api/gallery/category/FEA91F56-CBE3-4138-8BB6-62F9A5808D57/dance/2
//  http://localhost:3010/api/gallery/category/FEA91F56-CBE3-4138-8BB6-62F9A5808D57/dance/1
//  http://localhost:3010/api/gallery/category/00BEDDB7-A9AE-4438-A94B-5AD57B0730EB/Dance/2
router.get("/:siteid/:id/:pagenum?", function (request, response) {
    const siteid = request.params.siteid
    const config = configs.find(c => c.privateKeyID === siteid);
    const payload = {
        headers: request.headers, body: request.body, params: request.params, queryString: request.query
    };
    console.log({ GetCategory: payload, siteid: siteid });
    ListAllByCategory(config, response, payload, siteid).then((data) => {
        console.log({ ListAll_Category_Success: data });
        return response.send(data);
    }).catch((error) => {
        console.log({ ListCategories_Error: error });
        return response.send([]);
    });
});

//  https://nodeapi.launchfeatures.com/api/gallery/category/00BEDDB7-A9AE-4438-A94B-5AD57B0730EB
//  https://nodeapi.launchfeatures.com/api/gallery/category/FEA91F56-CBE3-4138-8BB6-62F9A5808D57
//  http://localhost:3010/api/gallery/category/00BEDDB7-A9AE-4438-A94B-5AD57B0730EB
//  http://localhost:3010/api/gallery/category/FEA91F56-CBE3-4138-8BB6-62F9A5808D57
router.get("/:siteid", function (request, response) {
    const siteid = request.params.siteid
    const config = configs.find(c => c.privateKeyID === siteid);
    const payload = {
        headers: request.headers, body: request.body, params: request.params, queryString: request.query
    };
    console.log({GetAllCategories: payload, siteid: siteid });
    ListAllCategories(config, response, payload, siteid).then((data) => {
        console.log({ ListAll_Category_Success: data });
        return response.send(data);
    }).catch((error) => {
        console.log({ ListCategories_Error: error });
        return response.send([]);
    });
});

function ListAllByCategory(config, response, payload, privateKeyID) {
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

            //console.log({siteid: siteid, params: params, id: params.id})

            // create Request object
            const request = new sql.Request();
            request.input('EntityTypeName', sql.NVarChar(64), 'ITCC_Gallery');
            request.input('Category', sql.NVarChar(256), params.id);

            let query = ' SELECT IM.* FROM ITCC_IMAGE IM (NOLOCK) ';
            query += ' JOIN ITCC_Website WS (NOLOCK) ON (IM.ITCC_WebsiteID = WS.ITCC_WebsiteID) ';
            query += ' WHERE (IM.EntityTypeName = @EntityTypeName) AND (WS.PrivateKeyID = ' + "'" + siteid + "'" + ' ) ';
            query += ' AND (IM.Category = @Category)';
            query += ' ORDER BY IM.UpdateDate Desc ';
            query += ' OFFSET ' + offset + ' ROWS ';
            query += ' FETCH NEXT ' + pageSize + ' ROWS ONLY ';
            //console.log({ Pre_Success: query, payload: payload });

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

function ListAllCategories(config, response, payload, privateKeyID) {
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

            //console.log({siteid: siteid, params: params, id: params.id})

            // create Request object
            const request = new sql.Request();
            request.input('EntityTypeName', sql.NVarChar(64), 'ITCC_Gallery');

            let query = ' SELECT DISTINCT Category, Count(*) Total FROM ITCC_IMAGE IM (NOLOCK) ';
            query += ' JOIN ITCC_Website WS (NOLOCK) ON (IM.ITCC_WebsiteID = WS.ITCC_WebsiteID) ';
            query += ' WHERE (IM.EntityTypeName = @EntityTypeName) AND (WS.PrivateKeyID = ' + "'" + siteid + "'" + ' ) ';
            query += ' AND (WS.PrivateKeyID = ' + "'" + siteid + "'" + ' ) ';
            query += '  GROUP BY Category ';
            //console.log({ Pre_Success: query, payload: payload });

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

module.exports = router;