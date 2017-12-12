const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

let Todo = mongoose.model('Todo',{
    text:{
        type: String,
        required: true,
        minlength:1,
        trim: true
    },
    completed:{
        type: Boolean,
        default: false 
    },

    completedAt:{
        type:Number,
        default: null
    }
});

// let newTodo = new Todo({
//     text: 'Cook diner'
// });

// newTodo.save().then((doc)=>{
//     console.log('saved todo', doc)
// }, (e)=>{
//     console.log('Unable to save todo');
// })

// let newTodo = new Todo({
//     text:' Edit this video  '
// });

// //NB Remember type type conversion applies. for example text set to true will result in true being converted to a string.

// newTodo.save().then((doc)=>{
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (e)=>{
//     console.log('Unable to save file',e);
//});

//User 
//email -required - trim, set type, set min length of 1 

let User = mongoose.model('User',{
    email:{
        type: String,
        required:true,
        minlength: 1,
        trim:true
    }
});

let newUser = new User({
    email:'johndoe@forexample.com'
});

newUser.save().then((doc)=>{
    console.log(JSON.stringify(doc, undefined, 2));
},(e)=>{
    ('Unable to save file', e)
});