var express = require('express.io');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var passport = require('passport');
var routes = require('./routes/index');
var dbroute = require('./routes/db');
var users = require('./routes/users');
var config = require('./config.js');
var OAuth       = require('oauth').OAuth;
var querystring = require('querystring');
var twitterconfig = require('./twitter.config.js');


console.log(twitterconfig);
// authentication for other twitter requests
var twitterOAuth = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    twitterconfig.twitter.consumerKey,
    twitterconfig.twitter.consumerSecret,
    "1.0",
    null,
    "HMAC-SHA1"
);



// var passport = require('passport');
// var TwitterStrategy = require('passport-twitter').Strategy;
// passport.use(new TwitterStrategy({
//     consumerKey: twitterconfig.twitter.consumerKey,
//     consumerSecret: twitterconfig.twitter.consumerSecret,
//     callbackURL: "http://sandbox.halic.be:3000/auth/twitter/callback"
//   },
//   function(token, tokenSecret, profile, done) {
//     console.log(profile);
//   }
// ));
var app = express();
var http = require('http').Server(app);
// var socketio = require('socket.io')
app.http().io()

app.use(express.basicAuth('algoraves', 'rock'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/auth/twitter', passport.authenticate('twitter'));
// app.get('/auth/twitter/callback',
//     passport.authenticate('twitter', { successRedirect: '/',
//                                      failureRedirect: '/login' }));
app.use('/', routes);
// app.use('/db', dbroute);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.io.route('command', {
    create: function(req) {
        console.log("creating command in database");
    },
    get: function(req) {
        console.log("getting command in database");
    }
});


init();

module.exports = app;

function init(){
    listenForTweets();
}


function listenForTweets(){
    // 2.) Luister ook naar nieuwe pictures die binnenkomen:
    var parameters = querystring.stringify({
        track: twitterconfig.app.searchterms.join(',')
    });

    var twitterhose = twitterOAuth.get('https://stream.twitter.com/1.1/statuses/filter.json?' + parameters, twitterconfig.twitter.token, twitterconfig.twitter.secret);
    twitterhose.addListener('response', function (res){
        console.log("searchhose started");
        res.setEncoding('utf8');
        res.addListener('data', function (chunk){
            try{
                var tweet = JSON.parse(chunk);
                console.log(tweet);
                // extract picture urls:
                getPictureUrlsFromTweet(tweet, function (err, pictures){
                    if(err) return console.log(err);

                    for(var i in pictures)
                        addPicture(pictures[i], State.importantpictures);
                });
            }catch(err){}
        });

        res.addListener('end', function(){
            console.log("Twitterhose broke down");
        });
    });
    twitterhose.end();
}




