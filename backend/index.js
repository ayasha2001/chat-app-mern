const express = require('express');
const dotenv=require("dotenv")
const app = express();
const connectDB=require('./config/database')
const {registerUser,authUser,getAllUsers}=require('./controllers/registeration')
const {accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup}=require('./controllers/chatControllers')
const {sendMessage,allMessages}=require('./controllers/messageControllers')
const {protect}=require('./middleware/authMiddleware')
dotenv.config()

connectDB();

const PORT=process.env.PORT||5000
app.use(express.json()) // to work with json data


app.route('/login').post(authUser)
app.route('/user').get(protect, getAllUsers).post(registerUser)
app.route('/chats').post(protect,accessChat).get(protect,fetchChats)
app.route('/group').post(protect,createGroupChat)
app.route('/message').post(protect,sendMessage)
app.route('/message/:chatId').get(protect,allMessages)

//app.route('/user').post(registerUser)
// app.post('/login',authUser)
//app.post('/user', registerUser)
//app.route('/groupadd').post(addToGroup)
//app.route('/groupremove').post(removeFromGroup)
//app.route("/rename").put(protect,renameGroup)


app.listen(PORT, console.log("server started"))

