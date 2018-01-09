

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const{todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);


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

describe('GET/users/me', ()=>{
    it('should return user if authenticated', (done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)//this how you send a header
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });
    it('should return 401 if not authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({})
        })
        .end(done);
    });
})

describe('POST/users', ()=>{
    it('it should create a user',(done)=>{
        let email = 'example@example.com';
        let password ='123mnb';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res)=>{
            expect(res.header['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end(err=>{
            if(err){
                return done(err)
            }

            User.findOne({email}).then((user)=>{
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            }).catch((e)=>done(e))
            
        });

    });
    it('should return validation errors if request invalid',(done)=>{
        let email = 'example.com';
        let password = '1234';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);

    })
    it('should not create user if email is already in use', (done)=>{
        let email ='jen@example.com';
        let password ='userThreePass';

        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done)
    })

})

describe('POST /users/login', ()=>{
    it('should login user and return auth tokem', (done)=>{
        request(app)
            .post('/users/login')
            .send({
                email:users[1].email,
                password:users[1].password
            })
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token:res.headers['x-auth']
                    })
                    done()
                }).catch((e)=>done(e))
            });
    });


    it('it should reject invalid login',(done)=>{
        request(app)
        .post('/users/login')
        .send({
            email:users[1].email,
            password:'abc1234'
        })
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res)=>{
            if(err){
                return done(err);
            }
            User.findById(users[1]._id).then((user)=>{
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e)=>done(e))
        })
    });
})