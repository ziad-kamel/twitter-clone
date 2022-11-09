const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostsSchema');


app.use(bodyParser.urlencoded({ extended:false }));

router.get('/' ,async(req, res , next)=>{

    var searchObj = req.query;
    if(searchObj.isReply !== undefined){
        var isReply = searchObj.isReply == "true";
        searchObj.replyTo = { $exists: isReply };
        delete searchObj.isReply;
        console.log(searchObj)
    }

    var results = await getPosts(searchObj);
    res.status(200).send(results);
});


router.get('/:id' ,async(req, res , next)=>{

    var postId = req.params.id;

    var postData = await getPosts({ _id:postId });
    postData = postData[0];

    var results ={
        postData: postData
    }

    if(postData.replyTo !== undefined){
        results.replyTo = postData.replyTo;
    }

    results.replies = await getPosts({replyTo: postId});
    res.status(200).send(results);
});


router.post('/' ,async(req, res , next)=>{
    if(!req.body.content){
        console.log("content param not sent with requist");
        return res.sendStatus(400);
    }

    var postData = {
        content: req.body.content,
        postedBy: req.session.user
    }

    if (req.body.replyTo) {
        postData.replyTo = req.body.replyTo;
    }

    Post.create(postData)
    .then(async(newPost)=>{
        newPost = await User.populate(newPost , {path: "postedBy"});
        res.status(201).send(newPost);
    })
    .catch((err)=>{
        console.log('somthing went wrong' + err);
        res.sendStatus(400);
    });


});


router.put('/:id/like' ,async(req, res , next)=>{

    var postId = req.params.id;
    var userId = req.session.user._id;

    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    var option = isLiked ? "$pull" : '$addToSet';

    
    //insert user like 
    req.session.user= await User.findByIdAndUpdate(userId , { [option]: {likes: postId} } , { new:true })
    .catch((err) =>{
        console.log(err);
        res.sendStatus(400);
    })
    

    //insert post like

    var post = await Post.findByIdAndUpdate(postId , { [option]: {likes: userId} } , { new:true })
    .catch((err) =>{
        console.log(err);
        res.sendStatus(400);
    })
    

    res.status(200).send(post);
});


router.post('/:id/retweet' ,async(req, res , next)=>{
    var postId = req.params.id;
    var userId = req.session.user._id;

    //try and delete retweet
    var deletedPost = await Post.findOneAndDelete({postedBy: userId , retweetData: postId})
    .catch((err) =>{
        console.log(err);
        res.sendStatus(400);
    }); 

    var option = deletedPost != null ? "$pull" : '$addToSet';
    
    var repost = deletedPost;

    if(repost == null){
        repost = await Post.create({ postedBy: userId , retweetData: postId})
        .catch((err) =>{
            console.log(err);
            res.sendStatus(400);
        });
    }
    
    

    //insert user retweet 
    req.session.user= await User.findByIdAndUpdate(userId , { [option]: {retweets: repost._id} } , { new:true })
    .catch((err) =>{
        console.log(err);
        res.sendStatus(400);
    })
    

    //insert post retweet

    var post = await Post.findByIdAndUpdate(postId , { [option]: {retweetUsers: userId} } , { new:true })
    .catch((err) =>{
        console.log(err);
        res.sendStatus(400);
    })
    

    res.status(200).send(post);
});


router.delete('/:id' , (req,res,next)=>{
    Post.findByIdAndDelete(req.params.id)
    .then(()=>res.sendStatus(202))
    .catch((err)=> {
        console.log(err);
        res.sendStatus(400);
    })
});


async function getPosts(filter) {
    
    var results= await Post.find(filter)
    .populate('postedBy')
    .populate('retweetData')
    .populate('replyTo')
    .sort({'createdAt': -1})
    .catch((err)=>{console.log(err)})

    results = await User.populate(results , {path: 'replyTo.postedBy'});
    return results = await User.populate(results , {path: 'retweetData.postedBy'});

}



module.exports = router;