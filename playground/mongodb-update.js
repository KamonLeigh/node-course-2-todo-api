//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');





MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
//   db.collection('Todos').findOneAndUpdate({
//     _id: new ObjectID('5a2e69605825cf098244ac6d')
//   }, {
//   $set:{
//       completed: true
//   }
//   }, {
//     returnOriginal: false
// }).then((result)=>{
//   console.log(result);
// })

db.collection('Users').findOneAndUpdate({_id: new ObjectID('5a2737cfb797d7062f990c94')
}, {
  $set:{
    name: 'Byron'
  },
  $inc:{
    age: +1
  }
},{
  returnOriginal:false
}).then((result)=>{
  console.log(result);
});

    //db.close();
});