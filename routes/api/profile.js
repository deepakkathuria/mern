const express =require ('express')
const auth = require('../../middleware/auth')
const Users = require('../../Models/Users')
const Profile = require('../../Models/Profile')
const {check,validationResult}=require('express-validator');



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
        console.log("errr")
        return res.status(400).json({msg:'No Profile'});
    }
    res.json(profile)



   }
   catch{
       console.log(err.message);
       res.status(500).send('Server Error')
   }
})




//POST api/profile
//create user profile and update
//private



router.post('/',
[auth,
[

check('status',"status required").not().isEmpty(),
check('skills',"skills required").not().isEmpty()

]
],
async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
}=req.body


//build profile object

const profileField = {}
profileField.user = req.user.id

if(company)profileField.company = company
if(website)profileField.website = website
if(location)profileField.location= location
if(bio)profileField.bio = bio
if(status)profileField.status = status
if(githubusername)profileField.githubusername = githubusername
if(skills){
    profileField.skills = skills.split(',').map(skill=>skill.trim())
}
console.log(profileField.skills)


//build social object 

profileField.social={}
if(youtube) profileField.social.youtube = youtube
if(twitter) profileField.social.twitter = twitter
if(facebook) profileField.social.facebook = facebook
if(linkedin) profileField.social.linkedin = linkedin
if(instagram) profileField.social.instagram = instagram


try{
    let profile = await Profile.findOne(
        {user:req.user.id});

        if(profile){
            //update

            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set:profileField},
                {new:true}
                );

                return res.json(profile)

        }

        //create
        profile = new Profile(profileField);
        await profile.save(
        res.json(profile)
        )
    
}catch(err){
    console.log(err.message);
    res.status(500).send('Server Error')
}




}
)





//GET api/profile
//GET all profile
//public



router.get('/',async(req,res)=>{

    try {

        const profiles = await Profile.find().populate('user',['name','avatar']);
        console.log(profiles,"profiles")
        res.json(profiles)
        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

})





//GET api/profile/user/:user_id
//GET  profile by userid
//public



router.get('/user/:user_id',async(req,res)=>{

    try {

        const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:"There is no profile"})
        }
        res.json(profile);
        console.log(profile,"profiles")
        res.json(profile)
        
    } catch (err) {
        console.error(err.message)
        if(err.Kind == 'ObjectId'){
            return res.status(400).json({msg:'profile not found'});
        }
        res.status(500).send('Server Error')
    }

})

//DELETE api/profile/user/:user_id
//DELTE  profile,user and posts
//private



router.delete('/',auth,async(req,res)=>{

    try {
        //remove profile

         await Profile.findOneAndRemove({user:req.user.id})
       //remove ser

         await User.findOneAndRemove({_id:req.user.id})


        res.json({msg:'User Deleted'})
        
    } catch (err) {
        console.error(err.message)
        if(err.Kind == 'ObjectId'){
            return res.status(400).json({msg:'profile not found'});
        }
        res.status(500).send('Server Error')
    }

})




//PUT api/profile/experience
//add profile experience
//private



router.put(

'/experience',
[
    auth,
    [
        check('title',"Title is required").not().isEmpty(),
        check('company',"Company is required").not().isEmpty(),
        check('from',"from date  is required").not().isEmpty()

    ]
],
async(req,res)=>{

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }


const{
    title,
    company,
    location,
    from,
    to,
    current,
    description
}=req.body


const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
}
console.log(newExp,"newexperience")


try{
    const profile = await Profile.findOne({user:req.user.id})

    profile.experience.unshift(newExp);
    await profile.save()
    res.json(profile)
}catch(err){
    console.error(err.message)
    res.status(500).send ('Server error')
}

}





)







//DELETE api/profile/experience/:exp_id
//Delete experience from profile
//private



router.delete('/experience/:exp_id',auth,async(req,res)=>{

    try {


        const profile = await Profile.findOne({user:req.user.id})

        //get remove index

        const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id)

        profile.experience.splice(removeIndex,1)
        await profile.save()
        res.json(profile)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
        
    }
})





//PUT api/profile/education
//add profile education
//private



router.put(

    '/education',
    [
        auth,
        [
            check('school',"school is required").not().isEmpty(),
            check('degree',"Degree is required").not().isEmpty(),
            check('fieldofstudy',"Field is required").not().isEmpty(),
            check('from',"fromdate  is required").not().isEmpty()

    
        ]
    ],
    async(req,res)=>{
    
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
    
    
    const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }=req.body

    console.log(req.body.fieldofstudy,"study")
    
    
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    console.log(newEdu,"neweducation")
    
    
    try{
        const profile = await Profile.findOne({user:req.user.id})
    
        profile.education.unshift(newEdu);
        await profile.save()
        res.json(profile)
    }catch(err){
        console.error(err.message)
        res.status(500).send ('Server error')
    }
    
    



//DELETE api/profile/education/:edu_id
//Delete education from profile
//private



router.delete('/education/:edu_id',auth,async(req,res)=>{

    try {


        const profile = await Profile.findOne({user:req.user.id})

        //get remove index

        const removeIndex = profile.education.map(item=>item.id).indexOf(req.params.edu_id)

        profile.education.splice(removeIndex,1)
        await profile.save()
        res.json(profile)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
        
    }
})






















    
    
    
    
}
    )



















module.exports = router