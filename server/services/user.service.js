const User = require("../models/user.model");
const bcrypt  = require("bcrypt");
const jwt = require("jsonwebtoken")

//Register User
const createUser =  async(body)=>{
    try {
        //check if the user already exits or not
        const findUser =  await User.findOne({email: body.email});
        if(findUser){
            throw new Error("User already exist");
        };
        const createUser =  await User.create(body);
        return createUser;
        
    } catch (error) {        
        console.log("Register Error",error);
        throw error;
    }

};

//Login User
const loginUser = async (email, password) => {
  try {      
      const user = await User.findOne({ email: email });
      if (!user) {
          throw new Error("Incorrect Email or Password");          
      }      
      const isPasswordValid = await user.isPasswordMatch(password);
      if (!isPasswordValid) {
          throw new Error("Incorrect Email or Password");
      }      
      console.log('User authenticated:', user);
        
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET, 
          { expiresIn: "1h" } 
      );

      return { user, token };
      return user;
  } catch (error) {
      console.error("Login error:", error.message);
      throw error;
  }
};


//To get all user
const getAllUsers =  async ()=>{
    try {
        const user  =  User.find({}, '-password');
        return  user
    } catch (error) {
      console.log(error)  ;
      throw error;
    }
};

//resetpassword
const resetUserPassword = async (email, password) => {
    try {
      const user = await User.findOne({ email: email });
  
      console.log("user", user);
  
      if (!user) {
        throw new Error("Incorrect email or password");
      }
  
      const hashPassword = await bcrypt.hash(password, 10);
  
      const updateUser = await User.findOneAndUpdate(
        { email: email },
        { password: hashPassword },
        {
          new: true,
        }
      );
      return updateUser;
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        throw new Error("User not found");
      }
  
      return { message: "User deleted successfully!" };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };
  

module.exports ={
    createUser,
    loginUser,
    getAllUsers,
    resetUserPassword,
    deleteUser,
    
}