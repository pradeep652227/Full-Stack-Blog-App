import express from "express";
import bcrypt from "bcrypt";
import { blogUser } from "./modules/mongoose.js";

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

app.use(express.urlencoded({ extended: true })); //body-parser enabled
app.use(express.json()); //parsing JSON (stringified) objects in the request bodies

/*POST requests*/
app.post("/post-signup", (req, res) => {
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
  let incomingData = req.body;
  // console.log(incomingData);
  incomingData["email"]=incomingData.email.toLowerCase();
  //finding the user
  blogUser
    .findOne({ email: incomingData.email })
    .then((user) => {
      let sendData={
        first_name:user.first_name,
        last_name:user.last_name,
        email:user.email
      }
      bcrypt
        .compare(incomingData.password, user.password)//compare the incoming password (hash it) with the stored password
        .then((result) => result === true? res.send(sendData):res.send(result))
        .catch((err) => res.send(err));
      console.log(user);
      // mongoose.disconnect();//disconnect
    })
    .catch((err) => {
      console.log("Error in Finding the User");
      console.log(err);
      // mongoose.disconnect();//disconnect
      res.status(500).json({ message: "Error in Finding the User" });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
