const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');



let app = express();
app.use(bodyParser.json())

app.post('/todos', (req, res)=>{
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc); //This returns the object with new information like id 
    },(e)=>{
        res.status(400).send(e)
    })
});

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos}) //by sending an object this allows greater flexibility
    },(e)=>{
        res.status(400).send(e);
    })
})

//Get /todos/123

app.get('/todos/:id',(req, res)=>{
    let id = req.params.id
    
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
      }

      Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
      }).catch((e)=> res.status(400).send())
});

app.listen(3000, ()=>{
    console.log('Started on port 3000')
});

module.exports ={app}