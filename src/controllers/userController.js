import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserSchema } from "../models/user";

const SECRET_KEY = 'userKey';

// compile schema into model
// so we can perform operations like creating a new user, updating users, finding users and so on
const User = mongoose.model("User", UserSchema);

export const registerUser = async(req, res) => {
    try {
        let newUser = new User(req.body);

        console.log(newUser,'newUser')

        const existingUser = await User.findOne({ email: req.body.email });
        
        if(existingUser) {
            return res.status(400).send('User already exists');
        }

        newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
        newUser.profile_image = null;
        const user = await newUser.save();

        return res.json({ 
            token: jwt.sign ({
                email: user.email, 
                first_name: user.first_name,
                last_name: user.last_name,
                _id: user._id
            }, 'userKey', { expiresIn: '1h' }),
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

export const loginUser = async(req, res) => {
    try {

        const { email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });

        }

        const validPassword = bcrypt.compareSync(password, user.hashPassword);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ email: user.email, _id: user._id }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ 
            token,
            user: {
                _id: user._id,
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).send('Unauthorized');
    }
}

export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('Invalid user ID');
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const checkToken = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Invalid or missing token' });
    }

    // generate new token for user
    const newToken = jwt.sign(
        {
            email: req.user.email, 
            _id: req.user._id 
        },
        SECRET_KEY,
        { expiresIn: '7d' }
    );

    return res.status(200).json({ token: newToken });
};