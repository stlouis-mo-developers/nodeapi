const sql = require("mssql");
const configs = require('../../config');
const path = require('path');
const router = require('express').Router();


router.post("/:siteid", async (request, response) => {
    try {
        const siteid = request.params.siteid || request.headers['pin'];
        const headers = request.headers;
        const body = request.body;
        const params = request.params;
        const queryString = request.query;

        const config = configs.find(c => c.privateKeyID === siteid);
        const payload = {
            headers: headers, body: body, params:params, queryString: queryString
        };

        return response.send(payload);
    }
    catch (err) {
        return response.send({error: "an error has occured! "});
    }
});


module.exports = router;