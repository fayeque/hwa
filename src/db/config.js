const mongoose = require("mongoose");

mongoose.connect("mongodb://fayeque123:fayeque123@devconnector-shard-00-00.mxfos.mongodb.net:27017,devconnector-shard-00-01.mxfos.mongodb.net:27017,devconnector-shard-00-02.mxfos.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=devConnector-shard-0&authSource=admin&retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true
    
}).then(() => {
    console.log(`Connection is Successful`);
}).catch((e) => {
    console.log(`no Connection`);
})