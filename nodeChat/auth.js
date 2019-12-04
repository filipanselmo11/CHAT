const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
    function findUser(username, callback){
        global.v8debug.collection("users").findOne({"username": username}, function(err, doc){
            callback(err, doc);
        });
    }

    function findUserById(id, callback){
        const ObjectId = require('mongodb').ObjectID;
        global.db.collection("users").findOne({_id: ObjectId(id) }, (err, doc) => {
            callback(err, doc);
        });
    }

    passport.serializeUser(function(user, done){
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
        findUserById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use(new LocalStrategy( {
        usernameField: 'username',
        passwordField: 'pasword'
    },
    (username, passport)))
}