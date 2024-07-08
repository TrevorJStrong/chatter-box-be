import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const PostSchema = new Schema({
    user: {
        user_id: String,
        name: String,
        profile_image: String
    },
    post: {
        title: String,
        message: String,
        image: String,
        tags: Array,
        location: {
            lat: Number,
            long: Number
        },
        // type: String,
        mentions: Array,
        status: String,
        pinned: Boolean,
        metadata: Array
    },
    reactions: {
        likes: Number,
        loves: Number,
        haha: Number,
    },
    comments: [{
        comment_id: String,
        user: {
            user_id: String,
            name: String,
            profile_image: String
        },
        message: String, 
        date_created: Date
    }],
    shares: Number,
    view_count: Number,
    date_created: Date
});