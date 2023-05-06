const app = require('./app');
const {PORT} = process.env;

const startApp =()=>{
app.listen(5000, ()=>{
    console.log('Auth Backend running on port');
});
}

startApp();