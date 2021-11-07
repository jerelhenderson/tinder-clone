const authRoutes = require("./auth");
const usersRoutes = require("./users");
const matchRequestRoutes = require("./requests");

module.exports = ({ app, dbConn, upload, constants }) => {
    authRoutes({ app, dbConn });
    userRoutes ({ app, dbConn, upload });
    matchRequestRoutes({ app, dbConn, constants });
};

