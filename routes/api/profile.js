const express =require ('express')
const auth = require('../../middleware/auth')
const Users = require('./Models/Users')
const Profile = require('./Models/Profile')

const router = express.Router();



//get api/profile/me
//get current user profile
//private


router.get('/me',auth,async(req,res)=>{
   try{

    const profile = await Profile.findOne({user:req.user.id}).populate(

        'user',
        ['name','avatar']
    );

    if(!profile){
        return res.status(400)
        json({msg:"No Profile"});
    }
    res.json(profile)



   }
   catch{
       console.log(err.message);
       res.status(500).send('Server Error')
   }
})


module.exports = router