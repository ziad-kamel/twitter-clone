const mongoose = require('mongoose');

class Database{

    constructor(){
        this.connect();
    }


    connect(){
        mongoose.connect("mongodb+srv://ziad:ziad@twitterclonecluster.au2zh.mongodb.net/TwetterCloneDB?retryWrites=true&w=majority")
        .then(()=>{
            console.log('DB connection succesful');
        })
        .catch((err)=>{
            console.log('DB connection error' + err);
        })
    }
}

module.exports = new Database();