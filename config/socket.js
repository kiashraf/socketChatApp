var crypto = require('crypto');


var randomRoomId = function () {
    return crypto.randomBytes(24).toString('hex');

}

module.exports.roomId = randomRoomId();