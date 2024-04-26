import express from "express";
import bcrypt from "bcrypt";
import { blogUser, blogPost } from "./modules/mongoose.js";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import generateUniqueID from "./modules/generateUniqueID.js";
import fs from "fs";

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for storing uploaded files
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, Date.now() + "-" + fileName); // Unique filename for each uploaded file
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

// Serve static files from the 'uploads' folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //will now serve all the images as static files on the routes of '/uploads'
app.use(express.urlencoded({ extended: true })); //body-parser enabled
app.use(express.json()); //parsing JSON (stringified) objects in the request bodies

/*POST requests*/

app.post("/update-post", upload.single("image"), (req, res) => {
  console.log("upload Post:-");
  const postObj = { ...req.body };
  console.log(postObj);

  if (req.body.image !== "undefined") {
    //delete the old image
    const oldImage = postObj.oldImage;
    const imagePath = "./uploads/" + oldImage;
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.log("Error in deleting the old image");
        console.log(err);
      } else console.log("Deleted the old Image");
    });
  }
  let updatedFields = {
    title: req.body.title,
    slug: req.body.slug,
    content: req.body.content,
    isPrivate: req.body.isPrivate,
  };
  if (req.body.image !== "undefined") {
    updatedFields["image"] = req.file.filename;
  }

  //Update the document
  console.log(updatedFields);
  blogPost
    .updateOne(
      { _id: postObj.postId },
      {
        $set: updatedFields,
      },
      { new: true }
    )
    .then((newPost) => {
      console.log(newPost);
      res.send(true);
    })
    .catch((err) => {
      console.log("Error in Updating Post");
      console.log(err);
      res.send(false);
    });
});
app.post("/server-create-post", upload.single("image"), (req, res) => {
  //adding a blog-post
  //upload.single(name attribute)
  let url = req.protocol + "://" + req.get("host");
  url += "/uploads/";
  let postData = req.body;
  let post = {
    //creating a post object
    ...postData,
    image: req.file.filename,
    imgURLPrefix: url,
  };
  console.log(post);
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

  //delete the file first
  blogPost
    .findOne({ _id: postId })
    .then((post) => {
      let imagePath = "./uploads/" + post.image;
      userId = post.userId;

      fs.unlink(imagePath, (err) => {
        //delete the file
        if (err) {
          console.log("Error in Deleting the Image");
          console.log(err);
        } else console.log("image deleted");
        //delete the post
        let isPrivate = post.isPrivate;
        console.log("isPrivate= " + isPrivate);
        if (!isPrivate) {
          //public post
          blogPost
            .deleteOne({ _id: postId })
            .then(() => res.send(true))
            .catch((err) => {
              console.log("error in deleting the PUBLIC POST");
              console.log(err);
              res.status(500).send(false);
            });
        } else {
          //privae post
          blogPost
            .deleteOne({ _id: postId })
            .then(() => {
              // After deleting the post from the blog collection, remove its reference from the user collection
              return blogUser.updateMany(
                { posts: postId },
                { $pull: { posts: postId } }
              );
            })
            .then(() => {
              console.log("Post deleted from both collections.");
              res.send(true);
            })
            .catch((err) => {
              console.error("Error deleting post:", err);
              res.status(500).send(false);
            });
        }
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

app.get("/",(req,res)=>{
  res.send(process.env.TESTING);
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export {app};