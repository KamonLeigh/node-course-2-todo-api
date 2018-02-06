

require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate')

const port = process.env.PORT;

let app = express();
app.use(bodyParser.json())

app.post('/todos',authenticate, async (req, res)=>{
    const todo = new Todo({
        text: req.body.text,
        _creator:req.user._id
    });
    try {
        const doc = await todo.save()
        res.send(doc);
    } catch(e){
        res.status(400).send(e)
    }
});

app.get('/todos',authenticate, async (req,res)=>{
    try{
        const todos = await Todo.find({ _creator:req.user._id});
        res.send({todos});
    } catch(e){
        res.status(400).send(e);
    }
});
    

//Get /todos/123

app.get('/todos/:id',authenticate,(req, res)=>{
    let id = req.params.id;
    
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
      }

      Todo.findOne({
        _id:id,
        _creator:req.user.id
      }).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
      }).catch((e)=> res.status(400).send())
});


//convert to async 
app.delete('/todos/:id',authenticate, async (req, res)=>{
    
        const id = req.params.id;
         if(!ObjectID.isValid(id)){
            return res.status(404).send();
            }
        try {
             const todo = await Todo.findOneAndRemove({ _id:id, _creator:req.user.id});
            if(!todo){
                return res.status(404).send();
            }
            res.status(200).send({todo});
    } catch(e){
        res.status(404).send();
    }
})

    //valaidate the id --> return a 404

    //remove todo by id
        //success 
            //if no doc send 404
            //if doc, send doc with 200
            //we need to run 200 because function will run success even if there is no file deleted 

        //error
            //400 with empty body

app.patch('/todos/:id', authenticate, (req,res)=>{
    let id = req.params.id;
    let body = _.pick(req.body,['text','completed']);
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id:id, _creator:req.user.id}, {$set:body}, {new: true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo})
    }).catch((e)=>{
        res.status(400).send();
    })
});
//Convert this
app.post('/users', async (req, res)=>{
    const body = _.pick(req.body,['email', 'password']);
    const user = new User(body);
    try{
        await  user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth',token).send(user);     
    } catch(e){
        res.status(400).send(e)
    }
});

//POST/users/login {email, password}

app.post('/users/login', async (req, res)=>{   
    try{
    const body = _.pick(req.body,['email','password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token =  await user.generateAuthToken();

        res.header('x-auth',token).send(user);
    } catch(e){
        res.status(400).send();
    }
});

app.get('/users/me', authenticate, (req, res)=>{
    res.send(req.user);
});


app.delete('/users/me/token', authenticate, async (req, res)=>{
    
    try{
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch(e){
        res.status(400).send();
    }
});

app.listen(port, ()=>{
    console.log(`Started up at port ${port}`)
})

module.exports = {app}