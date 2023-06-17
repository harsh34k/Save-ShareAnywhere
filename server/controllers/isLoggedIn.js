const JWT = require("jsonwebtoken");
const { validateToken } = require('../controllers/auth');
const secret = "$superMan@123";


// const isLoggedIn = (req, res, next) => {
//     const token = req.cookies.token; // assuming you are storing the token in a cookie
//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized: No token" });
//         // return res.redirect('/user/Signin');
//     }
//     try {
//         const decoded = JWT.verify(token, secret); // assuming you have set JWT_SECRET as an environment variable
//         req.user = decoded.user; // storing the user object in the request object
//         next();
//     } catch (err) {
//         console.error(err);

//         return res.status(401).json({ message: "Unauthorized" });
//     }
// }


const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token; // assuming you are storing the token in a cookie
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token" });
        // return res.redirect('/user/Signin');
    }
    try {
        const decoded = JWT.verify(token, secret); // assuming you have set JWT_SECRET as an environment variable
        // console.log("isdecod", decoded.username);
        const userID = decoded._id;

        // console.log("islogged", userID);
        res.locals.userID = userID; // storing the user object in the res.locals object
        req.user = decoded; // storing the user object in the request object
        next();
    } catch (err) {
        // console.error(err);

        return res.status(401).json({ message: "Unauthorized" });
    }
}


module.exports = isLoggedIn;


// (req, res, next) => {
//     console.log("hello");

//     try {
//         console.log("hi");
//         const token = req.cookies.token; // assuming you are storing the token in a cookie
//         console.log(token);
//         if (!token) {
//             // return res.status(401).json({ message: "Please SignIn First" });
//             return res.redirect('/user/Signin');
//         }
//         const decoded = jwt.verify(token, secret); // assuming you have set JWT_SECRET as an environment variable
//         req.user = decoded.user; // storing the user object in the request object
//         next();
//     } catch (err) {
//         console.error(err);
//         // console.log();
//         return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }
// };







// const isLoggedIn = (async (req, res, next) => {
//     console.log("hello hi hi");
//     try {
//         console.log(req.cookies);
//         const user = await validateToken(req.cookies.token)
//         if (user)
//             res.locals.user = user;
//         next();
//     } catch (error) {
//         console.log("error", error);
//         res.redirect("/user/signin");
//     }
// })