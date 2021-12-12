const express = require('express')

const router = express.Router();

const {check,validationResult}=require('express-validator/check');
const Users = require('./Models/Users');
const gravatar =  require('gravatar')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

// In order to work req.body we have to initialize the middleware for the body parser
//register user

router.post('/',[

    check ('name','Name is Required').not().isEmpty(),
    check ('email','PLz include valid email').isEmail(),
    check('password','Please Enter password with 5 or more character').isLength({min:5})

],

async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }



    const {name,email,password} = req.body
   
   
   
    try{
        //see if user exist
        let user = await Users.findOne({email})


        if(user){
            res.status(400).json[{msg:'User Already exist'}]
        }

      // if user not already exist then assign avatar

        const avatar = gravatar.url(email,{


            S:"200",
            r:"pg",
            d:"mm"
        })


        user = new Users({
            name,
            email,
            password,
            avatar
        })


    //bcrypt pssword

    const salt = await bcrypt.genSalt(10)

    user.password = await bcrypt.hash(password,salt);

    await user.save()

    const payload = {
        user:{
            id:user.id
        }
    }

    jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn:360000},
        (err,token)=>{
            if(err) throw err;
            res.json({token})
            
        }

);

}catch(err){

    console.error(err.message)
    res.status(500).send("servere error")
}
})


module.exports = router