const User = require("../models/user.model");
const bcrypt  = require("bcrypt");
const jwt = require("jsonwebtoken")

//Register User
const createUser = async (body) => {
  try {
    const { email, password, username } = body;
    const findUser = await User.findOne({ email });
    if (findUser) throw new Error("User already exist");

    const createUser = await User.create({
      username,
      email,
      password,
      isAdmin: false, 
    });
    return createUser;
  } catch (error) {
    console.log("Register Error", error);
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

    console.log("User found:", user); // ✅ Log user object

    const isPasswordValid = await user.isPasswordMatch(password);
    console.log("Password valid:", isPasswordValid); // ✅ Log password match result

    if (!isPasswordValid) {
      throw new Error("Incorrect Email or Password");
    }

    console.log("Is Admin:", user.isAdmin); // ✅ Log admin status

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { user, token };
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

//To get all user
const getAllUsers =  async ()=>{
    try {
     const users = await User.find({}, '-password');
    return users;
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