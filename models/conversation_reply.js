/**
 * Created by user on 06-08-2016.
 */

var mongoose = require('mongoose');


//var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var ConvReplySchema = new Schema({
    from_name: String,
    from_id: String,
    to_name: String,
    to_id: String,
    con_id: String,
    reply: String


});


module.exports = mongoose.model('ConversationReply', ConvReplySchema);