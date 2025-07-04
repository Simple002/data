const express = require("express")
const app = express()
require("dotenv").config()
const { default: mongoose } = require("mongoose");


app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.DATABASE)
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Завершить процесс при ошибке
});


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