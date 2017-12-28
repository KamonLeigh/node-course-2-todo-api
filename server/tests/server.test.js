

//import { disconnect } from 'cluster';

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
},
{
    _id: new ObjectID(),
    text:'Second test todo',
    completed:true,
    completedAt:333
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>done());
})

//The code above ensures we run with zero todos
//Need to create test data, in order to test GET route 

describe('POST /todos', ()=>{
    it('should create a new todo', (done)=>{
        let text = 'To do text'; 

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err, res)=>{
            if(err){
                return done(err);
            }

            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=> done(e));
        });
    });

    it('should not create todo with invalid body data',(done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res)=>{
        if(err){
            return done(err);
        }
        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done()
        }).catch((e)=>done(e));
    })
})
});

describe('GET /todos', ()=>{
    it('should get all todos', (done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2)
        })
        .end(done);
    }) //don't need to add anyting like above, since we are not doing anything async
})

describe('GET/todos/:id',()=>{
    it('should return valid doc',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done);
    });

    it('should return 404 if todo not found',(done)=>{
        //make sure you get a 404 back
        let test = new ObjectID().toHexString();
            request(app)
            .get(`/todos/${test}`)
            .expect(404)
            .end(done);
    });

    it('should return a 404 for non object ids',(done)=>{
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    })
});

describe('DELETE /todos/:id', ()=>{
    it('should remove a todo', (done)=>{
        let hexId = todos[1]._id.toHexString();
        
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexId)
        })
        .end((err, res)=>{
            if(err){
                return done(err)
            }
            Todo.findById(hexId).then((todo)=>{
                expect(todo).toNotExist();
                done()
            }).catch((e)=>done(e))
            //query database using findById toNotExist
            //expect(null).toNotExisr
        });
    });
     it('should return 404 if todo is not found', (done)=>{
        let test = new ObjectID().toHexString();
            request(app)
            .delete(`/todos/${test}`)
            .expect(404)
            .end(done);
     });
        it('should return a 404 for non object ids',(done)=>{
            request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done);
     });
})

describe('PATCH /todos/:id',()=>{
    it('should update the todo',(done)=>{
        let hexId = todos[0]._id.toHexString();
        let text ="set alarm";
        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            text,
            completed:true
        })
        .expect(200)
        .expect(res=>{
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(true)
            expect(res.body.todo.completedAt).toBeA('number')
        })
        .end(done)
     })  
       
    
        //grab id of first item
        //update text, set completed to true
        //200
        //text is changed, compeleted is true, completed is a number .toBeA
    it('should clear completedAt when todo is not completed', (done)=>{
        let hexId = todos[1]._id.toHexString();
        let text = "Update text";

        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            text,
            completed:false
        })
        .expect(200)
        .expect(res=>{
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(false)
            expect(res.body.todo.completedAt).toNotExist()
        })
        .end(done)
    });
});