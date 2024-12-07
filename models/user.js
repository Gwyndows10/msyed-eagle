/*
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
  });

  /*userSchema.pre("save", async function (next) {
    console.log('Before saving the user:', this);
    if (this.isModified("password")) {
      //const salt = await bcrypt.genSalt();
      //this.password = await bcrypt.hash(this.password, salt);
      console.log('Password modified, hashing the password');
      this.password = await bcrypt.hash(this.password, 10);
      console.log('Hashed password:', this.password);
    }
    next();
  });*/
  /*
  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Avoid rehashing
    this.password = await bcrypt.hash(this.password, 10);
    next();
});*/

  /*
  userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  
  const User = mongoose.models.User || mongoose.model("User", userSchema);
  export default User;*/