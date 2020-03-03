const express = require('express');
const router = express.Router();
const DriverPath = require('../models/DriverPath');
const UserData = require('../models/UserData');
const Deliveries = require('../models/Deliveries');


function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

router.get('/profile', async (req, res, next) => {
  try {
    result={}
    state=0;
    const user = await UserData.findOne({ username: req.user.username });
    if (user){
      result= user;
      response = 'Success'
    }
    else {
      response = 'Fail'
    }
  }catch(error){
      response= 'Error',
      state= 1
  }
  res.json({
    state: state,
    message: response,
    body: result
  })
});






router.post('/postPath', async (req, res, next) =>{
  try {
    state=0;
    response = 'Fail';
    const user = await UserData.findOne({ username: req.user.username });
    if (user.driver==true){
      const path = await DriverPath.create({
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        username: req.user.username
      })
      if (path){
      response = 'Success';
      const matches = await Deliveries.find({from: req.body.from,
        to: req.body.to,
        date: req.body.date, driver:null}, async (err, entries)=>{
          for (var entry = 0; entry < entries.length; entry++) {
          userVar = await UserData.findOne({username: req.user.username, driver: true});
          if(userVar){
            array=userVar.deliverySuggestions
            if(!isInArray(entries[entry]._id, array)){
              array.push(entries[entry]._id);
              userVar.deliverySuggestions=array;
            }
            updateUser = await UserData.updateOne({username: req.user.username}, userVar)
          }
        }
        })
      }
    }
  }catch(error){
    response = 'Error';
    state=1
  }

  res.json({
    state: state,
    message: response
  })
})






router.post('/postDelivery', async (req, res, next)=>{
    try{
      state=0;
      response= 'Fail';
      const user = await UserData.findOne({ username: req.user.username });
      const path = await DriverPath.findOne({ 
        from: req.body.from,
        to: req.body.to,
        date: req.body.date
      });
      
      if (path && user.driver==false){
        item = {from: req.body.from,
          to: req.body.to,
          date: req.body.date,
          cost: req.body.cost,
          dimensions: req.body.dimensions,
          weight: req.body.weight,
          fragile: req.body.fragile,
          liquid: req.body.liquid,
          flammable: req.body.flammable,
          status: req.body.status,
          progress: req.body.progress,
          username: req.user.username}
        const delivery = await Deliveries.create(item)
        await DriverPath.find({ 
          from: req.body.from,
          to: req.body.to,
          date: req.body.date
        }, async (err, entries)=>{
          for (var entry = 0; entry < entries.length; entry++) {
          userVar = await UserData.findOne({username: entries[entry].username, driver: true});
          if(userVar){
          foundDelivery = await Deliveries.findOne(item);
          array=userVar.deliverySuggestions
          if(!isInArray(foundDelivery._id, array)){
            array.push(foundDelivery._id);
            userVar.deliverySuggestions=array;
          }
          updateUser = await UserData.updateOne({username: entries[entry].username}, userVar)
        }
        }
        })
        if (delivery){response = 'Success'}
      }
    }catch(error){
      response= 'Error';
      state=1;
    }

    res.json({
      state: state,
      message: response
    })
})


router.get('/getDelivery', async (req, res, next) => {
  try {
    state= 0;
    response='Fail';
    resultSuggestions=[];
    deliveries=[];
    const user = await UserData.findOne({ username: req.user.username});
    if (user.driver == true){
    array = user.deliverySuggestions;
    for (var suggestion = 0; suggestion < array.length; suggestion++) {
      newRes = await Deliveries.findOne({_id: array[suggestion], driver:null});
      if(newRes != null){
      resultSuggestions.push(newRes);
      }
    }
    deliveries = await Deliveries.find({driver: req.user.username})
    if (resultSuggestions){
      response='Success'
    }
  }
  else{
    deliveries = await Deliveries.find({username: req.user.username})
  }

    
  }catch(error){
    response='Error';
    resultSuggestions=[];
    deliveries=[];
    state= 1;
  }
  res.json({
    state: state,
    message: response,
    suggestions: resultSuggestions,
    deliveries: deliveries
  })
});



router.post('/acceptDelivery', async(req, res, next) => {
  try{
    state=0;
    response='Fail';
    const user = await UserData.findOne({username: req.user.username})
    if (user){
    delivery = await Deliveries.findOne({_id: req.body._id, driver:null});
    if(delivery){
    delivery.driver = req.user.username;
    delivery.status = 'Accepted';
    delivery.progress = '0';
    const newDelivery = await Deliveries.updateOne({_id: req.body._id}, delivery);
    if(newDelivery){
      response='Success'
    }
  }
  }
}
  catch(error){
    state=1;
    response='Error'
  }
  res.json({
    state: state,
    message: response
  })
});



router.get('/suggestionFix', async(req, res, next)=>{
  try{
    state=0;
    reponse='Fail';
    userVar = await UserData.findOne({username: req.user.username});
    if(userVar.driver == true){
      array = userVar.deliverySuggestions;
    for (var suggestion = 0; suggestion < array.length; suggestion++) {
      newRes = await Deliveries.findOne({_id: array[suggestion]});
      if (newRes.driver != null){
        array.splice(suggestion, 1);
        suggestion-=1;
      }
    }
    userVar.deliverySuggestions=array;
    updateUser = await UserData.updateOne({username: req.user.username}, userVar)
    if (updateUser){
      response='Success'
    }
    }
    

  }
  catch(error){
    state=1;
    response='Error';
  }
  res.json({
    state: state,
    message: response
  })
});

router.post('/updateDelivery', async(req, res, next) => {
  try{
    state=0;
    response='Fail'
    const user = await UserData.findOne({username: req.user.username})
    if (user){
    delivery = await Deliveries.findOne({_id: req.body._id});
    if(delivery){
    delivery.status = req.body.status;
    if(req.body.status =="On The Way"){
    delivery.progress = '50';
    }
    if(req.body.status =="Delivered"){
      delivery.progress = '100';
    }
    const newDelivery = await Deliveries.updateOne({_id: req.body._id}, delivery);
    if(newDelivery){
      response='Success'
    }
  }
  }
}
  catch(error){
    state=1;
    response='Error'
  }
  res.json({
    state: state,
    message: response
  })
});




router.post('/deleteDelivery', async(req, res, next) => {
  try{
    state=0;
    reponse='Fail';
    userVar = await UserData.findOne({username: req.user.username});
    if(userVar.driver == true){
      array = userVar.deliverySuggestions;
    for (var suggestion = 0; suggestion < array.length; suggestion++) {
      newRes = await Deliveries.findOne({_id: array[suggestion]});
      if (newRes._id == req.body._id){
        array.splice(suggestion, 1);
      }
    }
    userVar.deliverySuggestions=array;
    console.log(userVar)
    updateUser = await UserData.updateOne({username: req.user.username}, userVar);
    console.log(updateUser)
    if (updateUser){
      response='Success'
    }
    }
    

  }
  catch(error){
    state=1;
    response='Error';
  }
  res.json({
    state: state,
    message: response
  })
});



module.exports = router;