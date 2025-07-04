const express = require("express")
const app = express()
require("dotenv").config()
const connectDB = require('./connect');
const { default: mongoose } = require("mongoose");

connectDB()
app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema(
  {
    "name":String
  }
)
const User = new mongoose.model("User",userSchema);

app.get('/',(req,res) =>{
  res.render("index")
})

app.post('/post', async (req,res)=>{
  const { name_text } = req.body;
  const user = User({name:name_text})

  await user.save()
  res.send("Сохранено")
})


const PORT = process.env.PORT || 8080;
app.listen(PORT,() => console.log("Server start work..."))