import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

/*setting mongoose and database*/
const blogPostSchema=new mongoose.Schema({
    title:String,
    content:String,
    isPrivate:Boolean,
    userEmail:String,
    image:String,
    imgURLPrefix:String
})
const blogUsersSchema = new mongoose.Schema({
    first_name: { type: String, required: [true, "First Name is required!"] },
    last_name: { type: String, required: [true, "Last Name is required!"] },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minLength: [8, "Minimum 08 characters are required!!"],
    },
    email: { type: String, required: [true, "Email Address is required"], unique: true },
    posts:[{}]
  });
  
  //collection created
const blogPost=new mongoose.model("blogPost",blogPostSchema);
const blogUser = new mongoose.model("BlogUser", blogUsersSchema);

main().catch((err) => console.log(err));
async function main() {
  // await mongoose.connect("mongodb://127.0.0.1:27017/blogUsersDB");
  await mongoose.connect(process.env.DATABASE_CONNECTION_URL);
}
/*Completed Mongoose setup*/

export {blogUser,blogPost};