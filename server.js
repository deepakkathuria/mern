const express = require('express')
const connectDB =require('./config/db')
// const jwt = reqiuire('jsonwebtoken')


const app = express();

//init middeware

app.use(express.json({extended:false}))



app.use('/api/users',require('./routes/api/users'))
app.use('/api/auth',require('./routes/api/auth'))

app.use('/api/profile',require('./routes/api/profile'))

app.use('/api/post',require('./routes/api/posts'))




connectDB();

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server Running ${PORT}`)
})


app.get('/',(req,res)=>{
    console.log("deepak api running")
    res.send("ddeeppaakk");
    
})