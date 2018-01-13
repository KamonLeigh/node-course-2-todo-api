

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

app.post('/todos',authenticate, (req, res)=>{
    let todo = new Todo({
        text: req.body.text,
        _creator:req.user._id
    });

    todo.save().then((doc)=>{
        res.send(doc); //This returns the object with new information like id 
    },(e)=>{
        res.status(400).send(e)
    })
});

app.get('/todos',authenticate,(req,res)=>{
    Todo.find({
        _creator:req.user._id
    }).then((todos)=>{
        res.send({todos}) //by sending an object this allows greater flexibility
    },(e)=>{
        res.status(400).send(e);
    })
})

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

app.delete('/todos/:id',authenticate, (req, res)=>{
    let id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id:id,
        _creator:req.user.id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
         res.status(200).send({todo});
         
    }).catch((e)=> res.status(404).send());

    //valaidate the id --> return a 404

    //remove todo by id
        //success 
            //if no doc send 404
            //if doc, send doc with 200
            //we need to run 200 because function will run success even if there is no file deleted 

        //error
            //400 with empty body
})

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

app.post('/users',(req, res)=>{
    let body = _.pick(req.body,['email', 'password']);
    let user = new User(body);

    user.save().then(()=>{
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(user);
    }).catch((e)=> {
        res.status(400).send(e)
    });
});

//POST/users/login {email, password}

app.post('/users/login', (req, res)=>{
    let body = _.pick(req.body,['email','password']);

    User.findByCredentials(body.email, body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
            })
        }).catch((e)=>{
        res.status(400).send();
    });
});

app.get('/users/me', authenticate, (req, res)=>{
    res.send(req.user);
});


app.delete('/users/me/token', authenticate, (req, res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    },()=>{
        res.status(400).send();
    })
})
app.listen(port, ()=>{
    console.log(`Started up at port ${port}`)
})

module.exports = {app}