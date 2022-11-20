const asyncHandler=require('express-async-handler')
const userModel=require('../models/userModel')
const generateToken= require('../config/generateToken')
const cookieparser=require('cookie-parser')
const helmet=require('helmet')




/*****************************REGISTER USER************************************/
const registerUser= asyncHandler( async (req,res)=>{

    console.log(req.body)
    const {name, contact, password,pic}=req.body;

// to check if all the fields are filled 
    if(!name|| !contact || !password)
    {
        res.status(400)
        throw new Error("Please Ennter all the Fields");      
    }

    const userExists = await userModel.findOne({name})

    if(userExists)
    {
        res.status(400);
        throw new Error("user already exists")
    }
    
    const user = await userModel.create({
        name, contact, password ,pic
    });

    if(user)
    {
        res.status(201).json({
            _id: user._id,
            name:user.name,
            contact:user.contact,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(400);
        throw new Error("Failed to create the user")
    }

});
/*************************LOGIN USER*****************************/

 const authUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;
    console.log(req.body)
    console.log(userName)
  
    const user = await userModel.findOne({ name:userName });
    console.log(user)
  
    if (user && (await user.matchPassword(password)) ) {           //userModel as services

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid User Name or Password");
    }
  });

/***********************GET ALL USERS*******************/

const getAllUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ?   { name: { $regex: req.query.search, $options: "i" }  }: {};  //regex is used to search in a specific pattern
  
    const users = await userModel.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  });
  


module.exports = {registerUser, authUser, getAllUsers}