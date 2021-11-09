// POST Request Body: "matchRequestFrom": "cometchat_id1",  "matchRequestTo": "cometchat_id2", "matchRequestSender": "First", "matchRequestReceiver": "Primera"}

module.exports = ({ app, dbConn, constants }) => {
    app.post("/request/create", (req, res) => {
        const { matchRequestFrom, matchRequestTo, matchRequestSender, matchRequestReceiver } = req.body;
        // four part statement for checking if the request exists in the database
        // 1. If all the passed values are true, notify the user, then...
        if (matchRequestFrom && matchRequestTo && matchRequestSender && matchRequestReceiver) {
            const checkReqSql = "SELECT * FROM match_request WHERE match_request_from = ? AND match_request_to = ?";

            dbConn.query(checkReqSql, [matchRequestFrom, matchRequestTo], (err, result) => {
                if (err) {
                    res.status(200).jsonp({ message: "Error. Please try again." });
                } else if (result && result.length !== 0) {
                    res.status(200).jsonp({ message: "Match requests already exists." });
                } else {
                    // 2. If one+ of the passed values are false...
                    const findMatchReqSql = "SELECT * FROM match_request WHERE match_request_from = ? AND match_request_to = ?";

                    dbConn.query(findMatchReqSql, [matchRequestTo, matchRequestFrom], (err, matchRequests) => {
                        if (err) {
                            res.stats(200).jsonp({ message: "Error. Please try again." });
                        } else if (matchRequests && matchRequests.length !== 0) {
                            // ...set matchRequestStatus to 0/1/-1 and tag the current date
                            const updateMatchReqSql = "UPDATE match_request SET match_request_status = ? accepted_date = ? WHERE id = ?";

                            dbConn.query(updateMatchReqSql, [constants.matchRequestStatus.accepted, new Date(), matchRequests[0].id], (err, updatedResults) => {
                                if (err) {
                                    res.status(200).jsonp({ message: "Error. Please try again." });
                                } else if (updatedResults) {
                                    res.status(200).jsonp({ match_request_status: constants.matchRequestStatus.accepted});
                                }
                            });
                        } else {
                            // 3. ...or create a matchRequestStatus (0/1/-1)
                            const status = constants.matchRequestStatus.pending;
                            const request = [[matchRequestFrom, matchRequestTo, matchRequestSender, matchRequestReceiver, status]];
                            const insertMatchInfo = "INSERT INTO match_request (match_request_from, match_request_to, match_request_sender, match_request_receiver, match_request_status) VALUES ?";

                            dbConn.query(insertMatchInfo, [request], (err, result) => {
                                if (err) {
                                    res.status(200).jsonp({ message: "Cannot create match request." });
                                } else {
                                    res.status(200).jsonp({ message: "Match request created successfully." });
                                }
                            });
                        }
                    });
                }
            });
        // 4. If the passed values aren't true, something went wrong
        } else {
            res.status(200).jsonp({ message: "Please provide opposite match requests."});
        }
    });
};