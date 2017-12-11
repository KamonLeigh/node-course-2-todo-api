//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');





MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
    //deleteMany- deletes all entries with the same reference. 
    // db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result)=>{
    //   console.log(result);
    // });

    //deleteOne- deletes the first entry
    // db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result)=>{
    //   console.log(result);
    // });

    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
    //   console.log(result);
    // });

    // //Excercis1
    //   db.collection('Users').deleteMany({name:'Byron'}).then((result)=>{
    //     console.log(result);
    //   });

    //Excercise 2 

          // db.collection('Users').findOneAndDelete({"_id" : 123}).then((result)=>{
          //   console.log(result);
          // })

          db.collection('Users').findOneAndDelete({
            _id: new ObjectID(123)
          }).then((results)=> {
            console.log(JSON.stringify(results, undefined, 2));
          })


    //db.close();
});