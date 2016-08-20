var mongoose = require('mongoose');


//var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var ConvSchema = new Schema({
    from_name: String,
    from_id: String,
    to_name: String,
    to_id: String,
    con_id: String


});


module.exports = mongoose.model('Conversation', ConvSchema);