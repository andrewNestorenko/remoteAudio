var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var UserSchema = Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    profileId: {
        type: String
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    rawUser: {
        type: Object
    },
    accessToken : {
        type : String
    },
    refreshToken : {
        type : String
    }
});

UserSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

UserSchema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this.plainPassword;
    });

UserSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports.User = mongoose.model('User', UserSchema);
