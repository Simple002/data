const express = require("express")
const { default: mongoose } = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const { type } = require("os")
const { name } = require("ejs")
require("dotenv").config()
const app = express()

app.use(express.json())
app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

mongoose.connect(process.env.DATABASE)
.then(() => console.log("MongoDB connected..."))
.catch((err) => console.log("ERROR..."))

const userSchema = mongoose.Schema(
    {
        name:{
            type:String,
            unique:true,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        describe:{
            type:String,
            default: ""
        }
    }
)

const User = mongoose.model("User",userSchema)

//-----------------------------------------------------------------------

async function Auth(req,res,next){
    const auth_token = req.cookies.token
    if(!auth_token){return res.redirect('/login')}

    try{
        const decoded = jwt.verify(auth_token,process.env.SECRET_KEY)
        req.user = decoded
        next()
    }catch{
        res.redirect('/login')
    }
}

//--------------------------------------------------------------------------------------

app.get('/',(req,res)=>{
    res.render("regis")
})

app.get('/login',async(req,res)=>{
    res.render('login')
})

app.get('/home',async(req,res)=>{
    res.render('home')
})

app.get('/profile',Auth,async(req,res)=>{
    const user = await User.findOne({name: req.user.name})
    res.render('profile',{ name:user.name , describe:user.describe })
})

app.get('/logout',(req,res)=>{
    res.clearCookie("token")
    res.json({logOut_status:true})
})

//--------------------------------------------------------------------------------------

app.get('/check',async(req,res)=>{
    const cookie = req.cookies.token;
    if(!cookie){return res.json({status:false})}

    try{
        const valid = jwt.verify(cookie,process.env.SECRET_KEY)
        res.json({status:true})
    }catch{
        res.json({status:false})
    }
})

app.post("/create",async (req,res)=>{
    const { username,password } = req.body;
    const find_user = await User.findOne({name:username})
    if(find_user){
        return res.status(401).json({status:false})
    }
    const token = jwt.sign({name:username},process.env.SECRET_KEY,{expiresIn:"7d"})
    const hash = await bcrypt.hash(password,10)

    res.cookie("token",token,{
        httpOnly:true,
        maxAge:36000000
    })

    const user = new User({name:username,password:hash})
    await user.save()
    res.redirect('/home')
})

app.post("/logIn",async (req,res)=>{
    const { username,password } = req.body;
    const cookie = req.cookies.token

    const find_user = await User.findOne({ name:username })
    if(!find_user){return res.status(401).json({status:false})}

    const check_hash = await bcrypt.compare(password,find_user.password)
    if(!check_hash){return res.status(401).json({status:false})}
    
    const token = jwt.sign({name:username},process.env.SECRET_KEY,{expiresIn:"7d"})

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 36000000
    });

    res.redirect('/home')
})

app.post('/describe',Auth,async (req,res)=>{
    const {des_text} = req.body
    const find_user = await User.findOne({name: req.user.name})
    find_user.describe = des_text
    await find_user.save()
    res.redirect('/profile')
})

app.post('/find', Auth, async (req,res)=>{
    const {find_res} = req.body;
    try{
        const user = await User.findOne({name:find_res})
        res.json({status:true,username:user.name})
    }catch{
        res.json({status:false,username:"User not found..."})
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server start work..."))