const { Router } = require("express");
const User = require("../models/User");
const router = Router();



//signup

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      // console.log("username already exists");
      return res.status(409).json({ message: 'Username already exists' });
    }
    const newUser = await User.create({
      username,
      password,
    });
    // console.log(newUser);
    res.sendStatus(200);
    // res.redirect("/user/Signin");
  } catch (err) {
    // console.log(err);
    res.sendStatus(500);
  }
});
// router.post("/signin", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const token = await User.validatePasswordAndGenerateToken(username, password)
//     res.cookie("token", token);
//     res.sendStatus(200)

//   } catch (error) {
//     if (error.message === "User dosen't exists.") {
//       // toast.error("User doesn't exist");
//       return res.status(409).json({ message: "User dosen't exists." });
//     } else if (error.message === "Password is wrong") {
//       // toast.error("Password is wrong");
//       return res.status(409).json({ message: "Password is wrong" });
//     } else {
//       // toast.error("Something went wrong");
//       console.log("reached this user.js ");
//       console.log(error);
//       return res.status(500).json({ message: "something else is wrong" });
//     }

//   }

// })
//signin

// router.get('/signin', (req, res) => {
//   // res.sendFile(path.join(__dirname, '../client/src/components/Signup.js')); // assuming you have built your React app in the "client/build" directory
// });


router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { token, user } = await User.validatePasswordAndGenerateToken(username, password);
    res.cookie("token", token);
    res.locals.user = user;
    // console.log(res.locals.user);
    res.sendStatus(200);
  } catch (error) {
    // console.log(error);
    res.status(409).json({ message: error.message });
  }
});




module.exports = router;