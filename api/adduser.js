const {
    Users,
    userAdd
} = require("../models/users");


const addUser = async userData => {
    if (!(await checkifExist(userData.email))) {
        let msg = await userAdd(userData);
        if (msg === true) {
            return {
                successmsg: "Successfully Onboarded!"
            };
        } else {
            return {
                errmsg: msg
            };
        }
    } else {
        return {
            errmsg: "Email Already Exist!"
        };
    }
};




const checkifExist = async (email) => {
    let userData = await Users.findOne({
            userEmail: email
        },
        "_id"
    );
    if (userData) {
        return true;
    }
    return false;
};

module.exports = {
    addUser
}