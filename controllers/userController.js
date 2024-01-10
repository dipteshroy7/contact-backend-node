const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Get all Contacts
//@route POST /users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All Fields are Mandatory");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User Already Exists");
    }
    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password = ", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    if (user) {
        console.log("User Created = ", user);
        res.status(201).json({ _id: user._id, email: user.email });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
});

//@desc Get all Contacts
//@route POST /users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All Fields are Mandatory");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user._id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "20m" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(400);
        throw new Error("email or password is not valid");
    }
});

//@desc Get all Contacts
//@route GET /users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.send(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
