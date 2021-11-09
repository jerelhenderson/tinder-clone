// Routing connections come through here

const authRoutes = require("./auth");
const userRoutes = require("./users");
const matchRequestRoutes = require("./requests");

module.exports = ({ app, dbConn, upload, constants }) => {
    authRoutes({ app, dbConn });
    userRoutes({ app, dbConn, upload, constants });
    matchRequestRoutes({ app, dbConn, constants });
};