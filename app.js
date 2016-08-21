var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');


var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var validator = require('express-validator');
var connection = require('./config/database');


//var routes = require('./routes/index');

var socket = require('./routes/socket');
var users = require('./routes/users');
var groupchat = require('./routes/groupchat');

var app = express();

var io = require('socket.io')();

app.io = io;

//connecting with the database

mongoose.connect(connection.url);

require('./config/passport')(passport);


var User = require('./models/user');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
 * Setting session Middleware as variable for Sockt.IO
 * */
var sessionMiddleware = session({
    secret: 'keyboardkafhlfaflhfdafcat',
    resave: false,
    saveUninitialized: true,
    httpOnly: true
    // cookie: {secure: true}
});

io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(validator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


require('./routes/index')(app, passport);


//app.use('/', routes);
app.use('/socket', socket);
app.use('/users', users);
app.use('/groupchat', groupchat);


/*
 * Socket IO
 * */


var chatUsers = [];

var socketChatUsers = [];

app.chatUsers = chatUsers;

var connections = [];

io.of('/track').on('connection', function (socket) {


    socket.on('getOnlineUsers', function (user) {

        console.log('A new user has Connected ' + socket.id);
        socket.emit('onlineUsersList', chatUsers);
        socket.broadcast.emit('onlineUsersList', chatUsers);

    });


});

io.of('/groupchat').on('connection', function (socket) {


    socket.on('client message', function (data) {

        io.of('/groupchat').emit('server message', data);

    });


});

io.of('/chat').on('connection', function (socket) {

    connections.push(socket);

    //socketChatUsers[data.currentUserId] = socket;

    console.log('A new user has Joined chat "connection" ' + socket.id);

    /*
     var UserId = socket.request.session.passport.user;
     */
    /*
     socket.on('getOnlineUsers', function (user) {

     console.log('A new user has Connected "getOnlineUsers" ' + socket.id);
     socket.emit('onlineUsersList', chatUsers);
     socket.broadcast.emit('onlineUsersList', chatUsers);


     });*/


    socket.on('join', function (data) {

        console.log('User "JOIN :"' + data.currentUserName);


//Inserting the joined User in a Hash to retrive it when it is disconnected.

        //var UserId = socket.request.session.passport.user;

        var userName = data.currentUserName;
        var userId = data.currentUserId;

        if (userId) {

            socketChatUsers.push({
                socketID: socket.id,
                userName: userName,
                userId: userId
            });

            console.log('SocketChatUsers :' + JSON.stringify(socketChatUsers));
        }
        socket.emit('onlineUsersList', socketChatUsers);
        socket.broadcast.emit('onlineUsersList', socketChatUsers);

        socket.join(data.currentUserId);

    });


    socket.on('client message', function (data) {


        // io.emit('chat message', data.msg); // => This will send to all clients including sender
        // socket.broadcast.emit('chat message', msg); // => Sending to all clients except sender
        //  socket.broadcast.to(data.to).emit('server message', {from: socket.id, to: data.to, msg: data.msg});// => Sending to specific user with socketId or ChatRoom name

        console.log(data.msg);

        // socket.join(data.to);
        //  socket.to(data.to).emit('server message', data.msg);
        socket.emit('server message', data);

        //socket.broadcast.emit('server message', data);
        io.of('/chat').to(data.to).emit('server message', data);

    });


    socket.on('disconnect', function () {

        console.log('A user has Disconnected ' + socket.id);


        for (var i = 0; i < socketChatUsers.length; i++) {
            if (socketChatUsers[i].socketID === socket.id) {

                socketChatUsers.splice(i, 1);
                break;
            }

        }
        socket.emit('onlineUsersList', socketChatUsers);
        socket.broadcast.emit('onlineUsersList', socketChatUsers);

    });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
