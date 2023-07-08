import express from "express";
import { addComment, addPicture, deletePic, getComment, getInfoUser, getPicById, getPicByName, getPicture, getSavedPic, savePicture, userLogin, userRegister } from "../controllers/userControllers.js";
import { verifyJWT } from "../config/jwt.js";

const userRouter = express.Router();

//register
userRouter.post("/register", userRegister);

//login
userRouter.post("/login", userLogin);

//get-info-user
userRouter.get("/get-user", verifyJWT, getInfoUser);

//add-pic
userRouter.post("/add-pic", addPicture);
//get-pic
userRouter.get("/get-pic", getPicture);
//get-pic-by-name
userRouter.get("/get-pic-name/:name", getPicByName);
//get-pic-by-id
userRouter.get("/get-pic-id/:id", getPicById);
//get-saved-by-user id
userRouter.get("/get-saved-img/:id", getSavedPic);

//get-comment
userRouter.get("/get-comment", getComment);
//add-comment
userRouter.post("/add-comment", addComment);
//save-picture
userRouter.post("/save-picture", savePicture);

//del-pic
userRouter.delete("/del-pic/:id", deletePic);
export default userRouter;