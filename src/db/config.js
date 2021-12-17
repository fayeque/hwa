const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/hwa",{
    useNewUrlParser:true,
    useUnifiedTopology:true
    
}).then(() => {
    console.log(`Connection is Successful`);
}).catch((e) => {
    console.log(`no Connection`);
})