import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
            }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);


        //profilephoto
        const randomNumber = Math.floor(Math.random() * 100);

        const maleProfilePhotos = `https://randomuser.me/api/portraits/men/${randomNumber}.jpg`;
        const femaleProfilePhotos = `https://randomuser.me/api/portraits/women/${randomNumber}.jpg`;
        

        await User.create({
             fullName, 
             username, 
             password: hashedPassword, 
             profilePhoto: gender === "male" ? maleProfilePhotos : femaleProfilePhotos, 
             gender 
            });
            return res.status(201).json({ message: "Account created successfully", 
               success: true 
            });

        
    } catch (error)  {
        console.error(error);
    }
    };

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if ( !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
            };
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username", success: false });    
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid password", success: false });
        }
        const tokenData = {
            userId: user._id,
        };
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
        return res.status(200).cookie("token", token, { maxAge:1*24*60*60*1000, httpOnly: true, sameSite: "strict"}).json({ 
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePhoto: user.profilePhoto
        });
        
    } catch (error) {
        console.error(error);
    }
}; 

export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({ 
            message: "Logged out successfully"
     })
    } catch (error) {
        console.error(error);
    }  
}

export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.error(error);
    }
}

