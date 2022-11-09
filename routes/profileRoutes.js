const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');

router.get('/' , (req, res , next)=>{

    var payload = {
        pagetitle: req.session.user.username,
        userLogedIn: req.session.user,
        userLogedInjs: JSON.stringify(req.session.user),
        profileUser: req.session.user
    }
    
    res.status(200).render('profilePage' ,payload);
});

router.get('/:username' , async(req, res , next)=>{
    var payload = await getPayload(req.params.username , req.session.user);

    res.status(200).render('profilePage' ,payload);
});

router.get('/:username/replies' , async(req, res , next)=>{
    var payload = await getPayload(req.params.username , req.session.user);
    payload.selectedTab = "replies";
    
    res.status(200).render('profilePage' ,payload);
});

async function getPayload(username , userLogedIn) {
    var user = await User.findOne({ username: username })
    
    if(user == null){
        
        user = await User.findById(username);

       if(user == null){
            return {
                pagetitle:'User not found',
                userLogedIn: userLogedIn,
                userLogedInjs: JSON.stringify(userLogedIn)
            }
       }
    }
    
    return {
        pagetitle: user.username,
        userLogedIn: userLogedIn,
        userLogedInjs: JSON.stringify(userLogedIn),
        profileUser: user
    }
}




module.exports = router;