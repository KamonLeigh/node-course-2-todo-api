const {ObjectID} = require('mongodb');
const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

// var id = "5a3483ef9178d595151ab0d511";

// if(!ObjectID.isValid(id)){
//     console.log('id is not valid')

// }
// // //This can return more than one document. You get back an array. Displays empty array if promise fails
// // Todo.find({
// //     _id: id
// // }).then((todos)=>{
// //     console.log('Todo', todos);
// // });

// // //This returns one document atmost. Get back a statement. Displays null if promise fails
// // Todo.findOne({
// //     _id: id
// // }).then((todo)=>{
// //     console.log('Todo',todo);
// // });

// // Displays null if promise fails. When need to add if statement to handle failure

// Todo.findById(id).then((todo)=>{
//     if(!todo){
//         return console.log('id not found')
//     }
//     console.log('Todo by id', todo);
// }).catch((e)=> console.log(e));

// // name: 'CastError',
// //   kind: 'ObjectId',
// //   value: '5a3483ef9178d595151ab0d511',
// //   path: '_id',
// //   reason: undefined }
// //This means the id is simplely invalid. Where as the if statement capatures valid id interms of format but NOT in excistence  

//User.findByid

let userId = "5a305dcb262dc02a25786746";

if(!ObjectID.isValid(userId)){
    console.log('id is not valid')
}

User.findById(userId).then((user)=>{
    if(!user){
        return console.log('user not found')
    }
    console.log(JSON.stringify(user, undefined,2))
}).catch((e)=>{
    console.log(e)
});

