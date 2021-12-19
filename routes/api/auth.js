const express =require ('express')
const auth = require('../../middleware/auth')
const router = express.Router();
const {check,validationResult}=require('express-validator/check');
const gravatar =  require('gravatar')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const Users = require('../../Models/Users');



router.get('/',auth,async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)

    }catch(err){
        console.log(err.message)
        res.status(500).send('Server Error')

    }
})



// POST api/auth
//suthenticate user and get token for login

router.post('/',[

    check ('email','PLz include valid email').isEmail(),
    check('password','Password is Required').exists()

],

async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }



    const {email,password} = req.body
   
   
   
    try{
        //see if user exist
        let user = await Users.findOne({email})


        if(!user){
            res.status(400).json({errors: [{msg:'Invalid credentials'}] })
        }
 
     const isMatch = await bcrypt.compare(password,user.password)
     if(!isMatch){
         return res
         .status(400)
        .json({errors: [{msg:'Invalid credentials'}]  })
     }

     

       
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