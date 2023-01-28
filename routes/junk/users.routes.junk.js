let router = require('express').Router()
var User = require('../../models/user.model')


router.get("/users", async (req, res) => {

    const date = new Date("2022-12-31T00:00:00.000Z");
  
    let prevUsers = await User.find({ createdAt: { $gt: date }, role: "agent", activated:false})
    
    // prevUsers.forEach(async user => {
    //     await User.findByIdAndUpdate(user?._id,{activated:true})
    //     console.log("13 UPDATED: ",user?.name,' - ',new Date(user?.createdAt).toLocaleDateString())
    // });
    
   res.json(prevUsers).status(200)

});


module.exports = router