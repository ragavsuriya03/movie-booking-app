const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4 : uuidv4} = require("uuid");
//const { atob, btoa } = require("b2a");
const TokenGenerator = require("uuid-token-generator");
const tokenGenerator = new TokenGenerator();

const User = db.users;

// Create and Save a user
exports.signUp= async (req, res) => {
  // Validate request
  if (!req.body.email && !req.body.password) {
    res.status(400).send({ message: "Please provide email and password to continue." });
    return;
  }
  
  try {
    const filter = { email: req.body.email };
    
    let data = await User.findOne(filter);
    console.log(data);
    console.log(req.body);
    
    if(data === null) {
    //If not found , Create a User
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const user = new User({
        userid: uuidv4(),
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.first_name+req.body.last_name,
        contact: req.body.mobile_number,
        password: hash,
        role: req.body.role ? req.body.role : "user",
        isLoggedIn: true, 
      });
      try {
        let userSaved =  user.save(user);
        res.send(userSaved);
      } 
      catch(err) {
        res.status(500).send({message: err.message || "Some error occurred, please try again later."});
      }
    }
    else {
    //User found with same email
      res.status(400).send({message: "User Already Exists."});
    }
  } 
  catch(err) {
    res.status(500).send({message: err.message || "Some error occurred, please try again later."});
  }
};


exports.login =async (req, res) => {
  try {
    
    // console.log(req.body)
    const { username, password } = req.body;
    
    // validate
    if (!username || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    
    const user = await User.findOne({ username: username });

    if (!user)
      return res.status(400).json({ msg: "No account with this email has been registered." });
  
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch)

    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
  
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY,{expiresIn: "2h",});
    res.json({token,details: {id: user._id,username: user.username,},});

  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.logout = async (req, res) => {
  //console.log('inside logout')
  
  if (!req.body.uuid) {
    res.status(400).send({ message: "Please provide user Id." });
    return;
  }
  try{
    console.log(req.body);
    const id = req.body.uuid;
    const update = { isLoggedIn: false};

    let user = User.findByIdAndUpdate(id, update);

    user.then((data) => {
      if (!data) {
        res.status(404).send({message: "Some error occurred, please try again later.",});
      } 
      else res.send({ message: "Logged Out successfully." });
    })
  } 
  catch (err) {
        res.status(500).send({message: "Error updating.",});
  }
    
};

exports.getCouponCode = async (req, res) => {
  // if (!req.body.coupens) {
  //   res.status(400).send({ message: "Please provide a valid Coupon." });
  //   return;
  // }

  // const coupens = req.body.coupens;

  // User.findByCoupons(coupens, update)
  //   .then((data) => {
  //     if (!data) {
  //       res.status(404).send({
  //         message: "Some error occurred, please try again later.",
  //       });
  //     } else res.send({ message: "Coupen Passed Succesfully" });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       message: "Error updating.",
  //     });
  //   });
  console.log("Start fetching coupons")
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  console.log(token)
  User.find({accesstoken: token}).then(function(user){
      if(user[0].coupens)
          res.send(user[0].coupens);
      else
          res.send([])
  });
 
};


exports.bookShow = (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  console.log(token)
  User.find({accesstoken: token}).then(function(user){
      if(user[0].bookingRequests)
          res.send(user[0].bookingRequests);
      else
          res.send([])
  });
 
};