const mongoose  = require("mongoose");
const bcrypt = require("bcryptjs")

const UserSchema =  mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email:{
        type: String,
        required:true,
        unique: true,
        lowercase: true
    },
    password:{
        type:String,
        required : true
    },
    isEmailVerified:{
        type:Boolean,
        required: true,
        default: true
    },
    isAdmin: { 
        type: Boolean, 
        default: false 
    }
   
},{ timestamps: true}
);

UserSchema.methods.isPasswordMatch = async function (password){
    const user =  this;
    return bcrypt.compare(password ,  user.password);
};
UserSchema.pre('save' , async function (next) {
    const user = this;

    if(user.isModified("password")){
        user.password =  await bcrypt.hash(user.password , 8);        
    }
    next();
})

const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User;