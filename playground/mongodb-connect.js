//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// let obj = new ObjectID;
// console.log(obj);



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //       text: 'Something to do',
    //       completed: false
    //     }, (err, result) => {
    //       if (err) {
    //         return console.log('Unable to insert todo', err);
    //       }
        
    //       console.log(JSON.stringify(result.ops, undefined, 2));
    //     });

    //insert new doc into Users {name, age, location}

    // db.collection('Users').insertOne({
    //     name:'Byron',
    //     age:37,
    //     location: 'Walthamstow'

    // }, (err, result)=>{
    //     if(err){
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2))
    // })
    db.close();
});