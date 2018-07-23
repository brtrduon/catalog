const passport = require('passport');
const Admin = require('../models/admin');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'username' };
const localLogin = new LocalStrategy(localOptions, function(username, password, done) {
    Admin.findOne({ username: username }, function(err, admin) {
        if (err) {
            return done(err);
        };

        if (!admin) {
            return done(null, false);
        }

        admin.comparePassword(password, function(err, isMatch) {
            if (err) {
                return done(err);
            };

            if (!isMatch) {
                return done(null, false);
            }

            return done(null, admin);
        });
    });
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    Admin.findById(payload.sub, function(err, admin) {
        console.log(admin);
        console.log('CRAAAAAAACK');
        if (err) {
            return done(err, false);
        }
        if (admin) {
            done(null, admin);
        }
        else {
            done(null, false);
        }
    });
});


passport.use(jwtLogin);
passport.use(localLogin);