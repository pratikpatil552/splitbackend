const {Router, application} = require("express");
const User = require("../models/user");
const Group = require("../models/group");

const router = new Router();


// dfs helping function 
async function dfs(i, n, temp) {
    if (i === n) {
        return [];
    }
    if (temp[i].first === 0) {
        return dfs(i + 1, n, temp);
    }
    
    let ans = [];

    for (let j = i + 1; j < n; j++) {
        let backup = temp[j].first;
        if (temp[i].first * temp[j].first < 0) {
            temp[j].first += temp[i].first;
            let tempans = await dfs(i + 1, n, temp);
            if (temp[i].first < 0) {
                tempans.push([{ from: temp[i].second, to: temp[j].second }, -temp[i].first]);
            } else {
                tempans.push([{ from: temp[j].second, to: temp[i].second }, temp[i].first]);
            }
            if (tempans.length < ans.length || ans.length === 0) {
                ans = tempans;
            }
            temp[j].first = backup;
        }
    }
    return ans;
}



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


// adding new transaction
router.post("/:number/:groupid/tran",async (req,res)=>{
    const {to, from, amount} = req.body;
    const memberself = await User.findOne({number:req.params.number});
    const groupself = await Group.findOne({_id:req.params.groupid});

    if(await groupself.members.includes(memberself._id)){
        const topep = await User.findOne({number:to});
        const frompep = await User.findOne({number:from});
        if(topep && frompep){
            await groupself.transactions.push({
                to:topep._id,
                from:frompep._id,
                amount,
                addedby:memberself._id
            })
            await groupself.save();
            return res.json({status:"success"});
        }
        else return res.json({status:"number does not exist in the group"});
    }
    else return res.json({status:"you are not the member of this group"});
})



// getting a group for which number is owner
router.get("/:number/own",async (req,res)=>{
    const ownerself = await User.findOne({number:req.params.number});
    const groups = await Group.find({owner:ownerself._id});
    return res.json(groups);
})

// getting a group for which number is memeber
router.get("/:number/memb",async (req,res)=>{
    const memberself = await User.findOne({number:req.params.number});
    const groups = await Group.find({members:{$in:[memberself._id]},owner:{$ne:memberself._id}});
    return res.json(groups);
})

router.get("/:id", async (req,res)=>{
    const groups = await Group.findOne({_id:req.params.id}).populate("members").populate("owner").populate({path:"transactions",populate:{path:'to'}}).populate({path:"transactions",populate:{path:'from'}}).populate({path:"transactions",populate:{path:'addedby'}});
    return res.json(groups);
})


// the actual simplify algorithm
router.get("/:groupid/cal",async (req,res)=>{
    const groupself = await Group.findOne({_id:req.params.groupid}).populate({path:"transactions",populate:{path:'to'}}).populate({path:"transactions",populate:{path:'from'}});
    const data = groupself.transactions;
    //return res.json(data);
    let arr = [];
    for (let i = 0; i < data.length; i++) {
        arr.push([{ from: data[i].from.number, to: data[i].to.number }, data[i].amount]);
    }
    //return res.json(arr);
    let mp = {};
    for (let it of arr) {
        mp[it[0].from] = (mp[it[0].from] || 0) - it[1];
        mp[it[0].to] = (mp[it[0].to] || 0) + it[1];
    }
    //return res.json(mp);

    let temp = [];
Object.entries(mp).forEach(([key, value]) => {
    if (value !== 0) {
        temp.push({ first: value, second: key });
    }
}); 
    //return res.json(temp);

    let n = temp.length;
    const result = await dfs(0, n, temp);
    return res.json(result);
})

module.exports = router;