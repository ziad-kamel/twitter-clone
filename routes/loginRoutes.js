const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');


app.set('view engine' , 'pug');
app.set('views' , 'views');
app.use(bodyParser.urlencoded({ extended:false }));

router.get('/' ,(req, res , next)=>{
    res.status(200).render('login');
});
router.post('/' ,async(req, res , next)=>{

    var payload = req.body;


    if(req.body.logUsername &&req.body.logpassword ){
        var user = await User.findOne({ 
            $or: [
                { username: req.body.logUsername },
                { email: req.body.logUsername }
            ]
         })
         .catch((err)=>{
            console.log(err);

            payload.errorMessage = "somthing went wrong";
            res.status(200).render('login' , payload);
         });

         if(user != null){
            //did find the user
            var result = await bcrypt.compare(req.body.logpassword , user.password);

            if(result === true){
                req.session.user = user;
                return res.redirect('/');
            }
            
         }

        payload.errorMessage = "login credintials incorrect";
        return res.status(200).render('login' , payload);
    }

    payload.errorMessage = "Make sure that each field has a valid value";

    res.status(200).render('login');
});

module.exports = router;