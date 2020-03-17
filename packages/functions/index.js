const { auth } = require('firebase-functions');
const { handler } = require('./src/signup');

exports.processSignUp = auth.user().onCreate(handler);
