import express from "express";
import bcrypt from "bcrypt";
import { blogUser, blogPost } from "./modules/mongoose.js";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import generateUniqueID from "./modules/generateUniqueID.js";

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
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

app.post("/create-post-server", upload.single("image"), (req, res) => {
  //adding a blog-post
  //upload.single(name attribute)
  let url = req.protocol + "://" + req.get("host");
  url += "/uploads/";
  let post = {
    //creating a post object
    title: req.body.title,
    content: req.body.content,
    userEmail: req.body.userEmail,
    isPrivate: req.body.isPrivate,
    image: req.file.filename,
    imgURLPrefix:url
  };
  console.log(post);
  if (post.isPrivate === "true") {
    //save the post to the user
    console.log("Inside true block");
    blogUser
      .findOne({ email: post.userEmail })
      .then((user) => {
        //found the user
        post["_id"] = generateUniqueID();
        user.posts.push(post);
        user.save();
        let sendData = {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          _id: user._id,
          isLoggedIn: true,
          posts: user.posts,
        };
        res
          .status(200)
          .json({ user: sendData, isPublicPost: false});
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
        res.status(200).json({
          message: "Post saved Public!!",
          isPublicPost: true,
          post: result
        });
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
      .then((result) => {
        res.status(200).send({ message: "User successfully saved." });
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
          email: user.email,
          _id: user._id,
          isLoggedIn: true,
          posts: user.posts,
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
app.get("/api/public-posts", (req, res) => {
  //get all the public posts
  let url = req.protocol + "://" + req.get("host");
  url += "/uploads/";
  blogPost
    .find({})
    .then((posts) => {
      res.status(200).json({
        posts: posts
      });
    })
    .catch((err) =>
      res.status(500).json({ message: "No Public Posts in the Database!!" })
    );
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
