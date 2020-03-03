const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserData = require('../models/UserData');
const UserModel = require('../models/UserModel');


const router = express.Router();


router.post('/register', passport.authenticate('register', { session : false }) , async (req, res, next) => {
  try {
    response='Error'
    const user = await UserData.create( {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      dateofbirth: req.body.dateofbirth,
      email: req.body.email,
      driver: req.body.driver,
    } );
    if(user){
      response='Success'
    }
  } catch (error) {
    response='Error';
    const found = await UserData.findOne({username: req.body.username});
    if(found){
      response='Fail'
    }
    if(!found){
      await UserModel.deleteOne({username: req.body.username})
    }

  }
  res.json({ 
    message : response
  });
});


router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {     try {
        if(err || !user){
          return res.json({message:'Fail'});
        }
        req.login(user, { session : false }, async (error) => {
          if( error ) return next(error)
          const body = { _id : user._id, username : user.username };
          const token = jwt.sign({ user : body },'Password_Strong');
          const userInstance = await UserData.findOne({username: user.username})
          if(userInstance.driver == true){response='driver' }
          else{ response = 'sender'}
          return res.json({ token, type:response, message:'Success' });
        });     } catch (error) {
        return res.json({message:'Fail'})
      }
    })(req, res, next);
  });






  router.route('/test').get((req, res) => {

            res.json({message:'Mrs Kilany I smell a 20/20. do you?'});

});


  
  module.exports = router;