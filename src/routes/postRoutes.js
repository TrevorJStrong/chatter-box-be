import { addNewPost, deletePost, getAllPosts, searchPostsByName, updatePost } from "../controllers/postController";
import { loginRequired } from "../controllers/userController";

const postRoutes = (app) => {
    app.route("/posts")
        .get(loginRequired, getAllPosts)
        .post(loginRequired, addNewPost)
        .put(updatePost)
        .delete(deletePost)

    app.route("/posts/search/:title")
        .get(searchPostsByName)
        
}

export default postRoutes;