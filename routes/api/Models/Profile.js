const mongoose = require('mongoose')

console.log(mongoose.Schema.Types,"monfoose")
const ProfileSchema = new mongoose.Schema({


   

user:  {
         type:mongoose.Schema.Types.objectId,
         ref:'Users'
},
    
company:{
        type:String,
 },
   website:{
     type: String,
 },
 location:{
     type: String,
     
 },
 skills:{
     type: [String],
     required: true
 },
 bio:{
    type: String,
    
},
githubusername:{
    type: String,
    
},

experience: [

{

    title:{
        type: String,
        required: true
        
    },
    company:{
        type: String,
        required: true
        
    },
    location:{
        type: String,
       
        
    },
    from:{
        type: Date,
        required:true
       
        
    },
    to:{
        type: Date,
 },

 current:{
    type: Boolean,
    default:false
},
description:{
    type: Date,
}

}
],

education: [
{
    school:{
        type: String,
        required:true
    },
    degree:{
        type: String,
        required:true
    },
    fieldofstudy:{
        type: String,
        required:true
    },
    from:{
        type: Date,
        required:true
    },
    to:{
        type: Date,
        required:true
    },
    current:{
        type: Boolean,
        defaut:false
    },
    description:{
        type:String
    }

}
],
social: {
    youtube:{
        type:String
    },
    twitter:{
        type:String
    },
    linkedin:{
        type:String
    },
    instagram:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
},

});

  module.exports  = Profile = mongoose.model('profile', ProfileSchema)















