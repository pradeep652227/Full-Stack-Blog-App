import mongoose from "mongoose";

/*setting mongoose and database*/
const blogUsersSchema = new mongoose.Schema({
    first_name: { type: String, required: [true, "First Name is required!"] },
    last_name: { type: String, required: [true, "Last Name is required!"] },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minLength: [8, "Minimum 08 characters are required!!"],
    },
    email: { type: String, required: [true, "Email Address is required"], unique: true },
  });
  
  //collection created
const blogUser = new mongoose.model("BlogUser", blogUsersSchema);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/blogUsersDB");
}
/*Completed Mongoose setup*/

export {blogUser};