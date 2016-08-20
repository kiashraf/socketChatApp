/**
 * Created by user on 23-07-2016.
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    mobile: {type: String, unique: true},
    password: String,
    confirmPassword : String,



});
//UserSchema.plugin(passportLocalMongoose);

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};







module.exports = mongoose.model('User', UserSchema);