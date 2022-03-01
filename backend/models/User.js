const mongoose = require('mongoose');

const { Schema } = mongoose;

  const UserSchema = new Schema({
    name:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true,
        unique : true
    },
    password:{
        type : String,
        required : true
    },
    date:{
        type : Date,
        default : Date.now//function run when document insert in mongo (don't call function i.e. Date.now())
    }
  });
  //schema is formed

  module.exports = mongoose.model('user',UserSchema);
  //mongoose.model(modelname,schema)=schema to model conversion

  //if same email is accepting more than one then add below code in place of module.exports = mongoose.model('user',UserSchema);
  //const User=  mongoose.model('user',UserSchema);
  //User.createIndexes()
  //module.export = User;