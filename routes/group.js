const {Router, application} = require("express");
const User = require("../models/user");
const Group = require("../models/group");


/*
/group/number/ -> post will create a new blog -> done and dusted
/group/number/groupid/pep -> will add the members
/group/number/groupid/trans -> will add the transactions
*/


const router = new Router();


// creating a new group
router.post("/:number",async (req,res)=>{
    const {name} = req.body;
    const ownerself = await User.findOne({number:req.params.number});
    try{
        const newGroup = await Group.create({
            name : name,
            owner : ownerself,
            members:[ownerself]  
        })
        return res.json({status:"successfully created"});
    }
    catch(error){
        console.log(error);
        return res.json({status:"problem while creating a group"});
    }
})


// adding memeber is done
router.post("/:number/:groupid/pep", async (req,res)=>{
    const {number} = req.body;
    const ownerself = await User.findOne({number:req.params.number});
    const groupself = await Group.findOne({_id:req.params.groupid});

    // members can be added by the owner only but for tranasaction any can add
    if(ownerself._id.equals(groupself.owner)){
        const newUser = await User.findOne({number});

        // checking that new user is valid or not
        if(!newUser) return res.json({status:"number does not exist"});

        // checking for already existed user
        if (await groupself.members.includes(newUser._id)) {
            return res.json({ status: "User is already a member of the group" });
        }

        // adding new user
        await groupself.members.push(newUser._id);
        await groupself.save();
        return res.json({status:"success"});
    }
    else return res.json({status:"You are not the owner"});
})

router.post("/:number/:groupid/tran",async (req,res)=>{
    const {to, from, amount} = req.body;
    const memberself = await User.findOne({number:req.params.number});
    const groupself = await Group.findOne({_id:req.params.groupid});

    if(await groupself.members.includes(memberself._id)){
        const topep = await User.findOne({number:to});
        const frompep = await User.findOne({number:from});
        console.log("to :",topep);
        console.log("from :",frompep);
        if(topep && frompep){
            await groupself.transactions.push({
                to:topep._id,
                from:frompep._id,
                amount,
                addedby:memberself._id
            })
            await groupself.save();
            return res.json({status:"transaction successfully added"});
        }
        else return res.json({status:"number does not exist in the group"});
    }
    else return res.json({status:"you are not the member of this group"});
})


// adding transaction is started


module.exports = router;