const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../controllers/auth");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        // required: true,
    },
}, { timestamps: true })

// hashing the password and generating salt;
userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();
})


//matching password and genrating token


userSchema.static("validatePasswordAndGenerateToken", async function (username, password) {
    const user = await this.findOne({ username });
    // console.log(user);

    if (!user) throw new Error("User doesn't exist.");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvideHash = createHmac("sha256", salt).update(password).digest("hex");

    if (!(hashedPassword === userProvideHash))
        throw new Error("Password is wrong");

    const token = createTokenForUser(user);
    return { token, user };
});




const User = model("user", userSchema);
module.exports = User;