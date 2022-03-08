
const sql = require("mssql");

const Authorize = {

    getAuthentication: async (config, userToken, userId, websiteId) => {
        try {
            await sql.connect(config);
            let query = 'SELECT TOP 1 UserToken FROM [ITCC_User] ';
            query += ' WHERE (ITCC_UserID = ' + Number(userId) + ') ';
            query += ' AND (UserToken = CAST(' + "'" + userToken + "'" + ' AS UNIQUEIDENTIFIER) ) ';
            const result = await sql.query(query);
            return result;
        } catch (err) {
            throw err
        }
    }
};



module.exports = Authorize;