import express from "express";
import bcrypt from "bcrypt";
import { blogUser, blogPost } from "./modules/mongoose.js";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import generateUniqueID from "./modules/generateUniqueID.js";
import fs from "fs";
import cloudinary from "./modules/cloudinary.js";

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

app.use(express.urlencoded({ extended: true })); //body-parser enabled
app.use(express.json()); //parsing JSON (stringified) objects in the request bodies

/*POST requests*/

app.post("/update-post", (req, res) => {
  console.log("upload Post:-");
  const postObj = { ...req.body };
  console.log(postObj);

  blogPost
    .updateOne({ _id: postObj.postId }, { $set: postObj })
    .then((result) => {
      console.log("Post Updated with result:-");
      console.log(result);
      res.send(true);
    })
    .catch((err) => {
      console.log("Error in Post Update");
      console.log(err);
      res.send(false);
    });
});

app.post("/server-create-post", (req, res) => {
  console.log(req.body);

  let postData = req.body;
  let post = {
    //creating a post object
    ...postData,
    imgURLPrefix: "",
  };
  if (post.userId) {
    //save the post to the user
    console.log("Inside true block");
    blogUser
      .findOne({ _id: post.userId })
      .then((user) => {
        //found the user
        blogPost.create(post).then((newPost) => {
          user.posts.push(newPost);
          user.save();
          res.send("Post added to the User");
        });
      })
      .catch((err) =>
        res
          .status(500)
          .json({ message: "Error in Saving this Post to the User" })
      );
  } else {
    //save the post as public
    console.log("Inside Else Block of Create Post");
    blogPost
      .create(post)
      .then((result) => {
        res.send("Post Added Public!!");
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ message: "Error in Saving this Post as Public" });
      });
  }
});

app.post("/post-signup", (req, res) => {
  //user registration
  let incomingData = req.body;
  console.log(incomingData); //received data console.log

  let email_ = incomingData.email;
  email_ = email_.toLowerCase();
  incomingData["email"] = email_; //lowercase email
  let newUser = new blogUser(incomingData);

  //registering a user with hash password
  bcrypt.hash(incomingData.password, saltRounds, (err, hash) => {
    newUser["password"] = hash;
    newUser
      .save()
      .then((user) => {
        let sendData = {
          first_name: user.first_name,
          last_name: user.last_name,
          id: user._id, //will be needed when selecting private posts
        };
        res.send(sendData);
        // res.status(200).send({ message: "User successfully saved." });
      })
      .catch((err) => {
        if (err.code === 11000) {
          // MongoDB duplicate key error
          res
            .status(400)
            .json({ message: "Email already exists in the database." });
        } else if (err.name === "ValidationError") {
          // Mongoose validation error
          const errors = Object.values(err.errors).map((val) => val.message);
          res.status(400).json({ message: errors.join("\n") });
        } else {
          res.status(500).json({ message: "Internal server error." });
        }
      });
  });

  // mongoose.disconnect();//disconnect
});

app.post("/post-login", (req, res) => {
  //user-login
  let incomingData = req.body;
  // console.log(incomingData);
  incomingData["email"] = incomingData.email.toLowerCase();
  //finding the user
  blogUser
    .findOne({ email: incomingData.email })
    .then((user) => {
      if (user) {
        let sendData = {
          first_name: user.first_name,
          last_name: user.last_name,
          id: user._id,
        };
        bcrypt
          .compare(incomingData.password, user.password) //compare the incoming password (hash it) with the stored password
          .then((result) =>
            result === true ? res.send(sendData) : res.send(result)
          )
          .catch((err) =>
            res.status(500).json({ message: "Error in Database!!" })
          );
        console.log(user);
      } else
        res.status(500).json({ message: "No Such User Exists!! Create One" });
      // mongoose.disconnect();//disconnect
    })
    .catch((err) => {
      console.log("Error in Finding the User");
      console.log(err);
      // mongoose.disconnect();//disconnect
      res.status(500).json({ message: "Error in Finding the User" });
    });
});

/*GET Requests */
app.get("/api/delete-post/:postId", (req, res) => {
  const postId = req.params.postId;
  console.log("Delete Post Route with postId:-" + postId);
  let userId = 0;

  //file deleted from appwrite

  blogPost
    .findOne({ _id: postId })
    .then((post) => {
      //delete the post
      blogPost
        .deleteOne({ _id: postId })
        .then((result) => {
          if (post.user !== "") {
            //delete reference from user also
            blogUser
              .updateMany({ posts: postId }, { $pull: { posts: postId } })
              .then(() => res.send(true))
              .catch((err) => {
                console.log("Error in Deleting Reference from User");
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log("Error in Deleting Post");
          console.log(err);
        });
    })
    .catch((err) => {
      //last catch
      console.log("Error in Finding the Blog Post");
      console.log(err);
      res.status(500).send(false);
    });
});
app.get("/api/posts/:userId", (req, res) => {
  const userId = req.params.userId;

  if (userId === null) userId = 0;
  blogPost
    .find({
      $or: [{ isPrivate: false }, { isPrivate: true, userId: userId }],
    })
    .then((posts) => {
      res.send(posts);
    })
    .catch((err) => {
      console.log("");
      console.log(err);
      res.status(500).json({ message: "Error in Finding Posts!!" });
    });
});

app.get("/", (req, res) => {
  res.send("Hi");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
