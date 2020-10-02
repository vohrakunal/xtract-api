const mongoose = require("mongoose");

const {
    model,
    Schema
} = require("mongoose");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const config = require("config");

const {
    ObjectId
} = Schema.Types;

const SALT_WORK_FACTOR = 10;


const userSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: () => {
            return Date.now();
        }
    },
    name: {
        type: String
    },
    userEmail: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    files: [{
        fileId: {
            type: ObjectId
        },
        ori_name:{
            type:String
        },
        timeStamp: {
            type: Date,
            default: () => {
                return Date.now();
            }
        }
    }]
});



userSchema.methods.setPassword = async function (password) {
    this.salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(password, this.salt);
};



userSchema.methods.validatePassword = async function (inpPassword) {
    return await bcrypt.compare(inpPassword, this.password);
};



userSchema.methods.generateJwt = function () {
    const jwtToken = jwt.sign({
            id: this._id,
            userEmail: this.userEmail,
            name: this.name
        },
        config.get("jwtsecret"), {
            expiresIn: config.get("jwtexp")
        }
    );
    return jwtToken;
};

const Users = model("users", userSchema);

const userLogin = user => {
    const schema = Joi.object({
        username: Joi.string()
            .min(4)
            .max(50)
            .required(),

        password: Joi.string()
            .min(4)
            .max(255)
            .required()
    });

    return schema.validate(user);
};


const userAdd = async userData => {
    let user = new Users();

    user.name = userData.name;

    user.userEmail = userData.email;


    await user.setPassword(userData.password);

    await user.save();

    return true;
};

module.exports = {
    Users,
    userLogin,
    userAdd
};
