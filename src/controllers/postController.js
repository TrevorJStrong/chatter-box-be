import mongoose from "mongoose";
import { PostSchema } from "../models/posts";
import { UserSchema } from "../models/user";

const Post = mongoose.model("Post", PostSchema);

const User = mongoose.model("User", UserSchema);

export const addNewPost = async(req, res) => {
    console.log(req.body, 'show request body')
    const getUser = await User.findById(req.body.user_id);
    if(!getUser) {
        return res.status(401).send('User not found');
    }
    console.log(getUser, 'get user');
    try {
        let newPost = new Post({
            user: {
                user_id: getUser._id,
                name: getUser.first_name + ' ' + getUser.last_name,
                profile_image: getUser.profile_image,
            },
            post: {
                title: req.body.title,
                message: req.body.message,
                image: req.body.image,
                tags: req.body.tags,
                location:{
                    lat: req.body.lat, 
                    long: req.long
                },
                mentions: req.mentions,
                status: req.status,
            },
            comments: [],
            reactions: {
                likes: 0,
                loves: 0,
                haha : 0
            }, 
            shares: 0,
            view_count: 0,
            date_created: Date.now()
        });
        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        res.status(500).send(error);        
    }
};

export const getAllPosts = async(req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
export const updatePost = async(req, res) => {
    try {
        const post = await Post.findByIdAndUpdate({_id: req.params.id}, req.body, { new: true }, (err, doc) => {
            if (err) {
                res.status(500).send(err);
            }
        });
        res.json(post);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const deletePost = async(req, res) => {
    try {
        const getUser = await Post.findById(req.params.id);
        const getPost = await Post.findById(req.params.postId);
        if(getUser._id === getPost.user._id) {
            const post = await Post.findByIdAndDelete(req.params.postId);
            res.json(post);
        }      
    } catch (error) {
        res.json({
            message: 'Successfully deleted the post',
        })
    }
}

export const searchPostsByName = async(req, res) => {
    const postTitle = req.params.title
    try {
        const posts = await Post.find({
            'post.title': { $regex: postTitle, $options: 'i' }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
};