const express = require('express');
const app = express();
const port = 3003;
const middleware = require('./middleware');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./database');
const session = require('express-session');

const server = app.listen(port , ()=>console.log(`server is listing on port ${port}`));

app.set('view engine' , 'pug');
app.set('views' , 'views');


app.use(bodyParser.urlencoded({ extended:false }));
app.use(express.static(path.join(__dirname , 'public')));

app.use(session({
    secret: "sl3awyyy",
    resave: true,
    saveUninitialized:false
}));
//routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const postRoute = require('./routes/postRoutes');
const profileRoute = require('./routes/profileRoutes');
const logoutRoute = require('./routes/logout');

//api Routes
const postsApiRoutes = require('./routes/api/posts');

app.use('/login' , loginRoute);
app.use('/register' , registerRoute);
app.use('/posts' ,middleware.requireLogin, postRoute);
app.use('/profile' ,middleware.requireLogin, profileRoute);
app.use('/logout' , logoutRoute);


app.use('/api/posts' , postsApiRoutes);

app.get('/' , middleware.requireLogin,(req, res , next)=>{
    var payload = {
        pagetitle: 'Home',
        userLogedIn: req.session.user,
        userLogedInjs: JSON.stringify(req.session.user)
    };
    res.status(200).render('home',payload);
});