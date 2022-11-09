const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchaema = new Schema({
    firstName:{ type: String, require: true, trim: true },
    lastName:{ type: String, require: true, trim: true },
    username:{ type: String, require: true, trim: true , unique:true },
    email:{ type: String, require: true, trim: true , unique:true },
    password:{ type: String, require: true},
    profilePic:{ type: String, default: "/images/profilePic.jpg" },
    likes: [{ type:Schema.Types.ObjectId , ref: "Posts"}],
    retweets: [{ type:Schema.Types.ObjectId , ref: "Posts"}],
    following: [{ type:Schema.Types.ObjectId , ref: "User"}],
    followers: [{ type:Schema.Types.ObjectId , ref: "User"}]
} , { timestamps:true });

var User = mongoose.model('User' , UserSchaema);

module.exports = User;