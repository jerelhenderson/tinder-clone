// POST Request Body Format: email: user@provider.com, password: h0p3fullystr0ng, age: #, gender: gender, ccUid: cometchat_id, fullname: First Lastname

module.exports = ({ app, dbConn, upload, constants }) => {
    app.post("users/create", upload.single("avatar"), (re, res, next) => {
        // photo checks
        const file = req.file;

        if (!file || !file.mimetype.includes("jpeg")) {
            res.status(200).jsonp({
                message: "Please upload a profile picture",
            });
        } else {
            // user info checks
            const avatar = `/img${file.filename}`;
            const { email, password, fullname, age, gender, ccUid } = req.body;

            if (email && password && fullname && age && gender) {
                // email check
                const sql = "SELECT * FROM user_account WHERE user_email = ?";

                dbConn.query(sql, [email], (err, result) => {
                    if (result && result.length !== 0) {
                        res.status(200).json({ message: "Email exists" });
                    } else {
                        // If the user doesn't exist, create one
                        const users = [[email, password, fullname, age, avatar, gender, ccUid]];
                        const insertUser = "INSERT INTO user_account (user_email, user_password, user_full_name, user_age, user_avatar, user_gender, user_cometchat_uid) VALUES ?";
                        dbConn.query(insertUser, [users], (err, result) => {
                            if (err) {
                                res.status(200).jsonp({ message: "Your account cannot be created. Please try again." });
                            } else {
                                res.status(200).jsonp({ avatar, insertId: result.insertId });
                            }
                        });
                    }
                });
            } else {
                return res.status(200).jsonp({ message: "Please fill out all required fields" });
            }
        }
    });

// POST Request Body: { "gender": "female", "ccUid": "comentchat_id" }

    const returnRecommendedUser = (users) => {
        if (users && users.length !== 0) {
            return users.map(user => {
                return {
                    id: user.id,
                    user_age: user.user_age,
                    user_avatar: user.user_avatar,
                    user_cometchat_uid: user.user_cometchat_uid,
                    user_email: user.user_email,
                    user_full_name: user.user_full_name,
                    user_gender: user.user_gender
                }
            });
        }
        return users;
    }

    // Select user from the opposite gender + current user not in (current match_requests + encountered(0, 1, or -1)
    app.post('/users/recommend', (req, res) => {
        const { gender, ccUid } = req.body;

        if (gender && ccUid) {
        const findUser = "SELECT * FROM user_account WHERE user_gender = ? AND (user_cometchat_uid NOT IN (SELECT match_request_to FROM match_request WHERE match_request_from = ?) AND user_cometchat_uid NOT IN (SELECT match_request_from FROM match_request WHERE match_request_to = ? AND match_request_status = ?))";

        dbConn.query(findUser, [gender, ccUid, ccUid, constants.matchRequestStatus.accepted], (err, result) => {
            if (err) {
                res.status(200).jsonp({ message: 'Cannot get your matches, please try again' });
            } else {
                const recommendedUsers = returnRecommendedUsers(result);
                res.status(200).jsonp(recommendedUsers);
            }
        });
        } else {
            res.status(200).jsonp({ message: "Please provide Cometchat ID and user's gender" });
        }
    });
};