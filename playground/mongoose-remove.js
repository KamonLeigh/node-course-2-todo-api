const {ObjectID} = require('mongodb');
const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");


//To remove the entire file you need to include an empty object

// Todo.remove({}).then((result)=>{  //remember in the response you get result { n:3, ok:2 }
//     console.log(result);
// });



//Todo.findOneAndRemove 
//You do get the object back. Not like .remove

//Todo.findByIdAndRemove

// Todo.findOneAndRemove({_id:'5a3d3eecbef6819be8c7404e'}).then((doc)=>{
//     console.log(doc);
// })

// Todo.findByIdAndRemove('5a3d3eecbef6819be8c7404e').then((doc)=>{
//     console.log(doc);
// })