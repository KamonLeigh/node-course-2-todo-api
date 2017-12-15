//import { disconnect } from 'cluster';

const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    text: 'First test todo'
},
{
    text:'Second test todo'
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
                return done(err)
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