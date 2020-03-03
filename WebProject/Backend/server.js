const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const cors = require('cors')
const UserModel = require('./models/UserModel');

mongoose.connect('mongodb://127.0.0.1:27017/Production');
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

require('./authentication/authentication');

app.use( bodyParser.json() );
app.use(cors())

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

app.use('/', routes);
app.use('/user', passport.authenticate('jwt', { session : false }), secureRoute );


app.listen(5010, () => {
  console.log('10.81.14.68','Server Listening on Port 5010!')
});
