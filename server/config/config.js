const env = process.env.NODE_ENV || 'development';

console.log('env ****', env)


if(env === 'development' || env === 'test'){
    let config = require('./config.json');  //don't need to convert to js. require handles this
    let envConfig = config[env];

    //Object.keys(envConfig);
    //This returns an array [ 'PORT', 'MONGODB_URI' ]

    Object.keys(envConfig).forEach((key)=>{
        process.env[key] = envConfig[key];
    });


}





// if(env === 'development'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }else if(env === 'test'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI ='mongodb://localhost:27017/TodoAppTest';
// }