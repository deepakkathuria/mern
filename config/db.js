const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')

console.log(db,"db woring")




const connectDB = async () => {

    try{
        console.log("its working")

        await mongoose.connect(db)
        console.log("connected")

    }catch(err){

        console.error(err.message);
        console.log("crashed")

        process.exit(1)

    }
}

module.exports = connectDB;