import mongoose, { Schema } from "mongoose";

const recipientSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    ID: {
      type: String,
      required: true,
      unique: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    registrationDate: {
      type: Date,
      required: true,
    },
    tookFood: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recipient = mongoose.models.Recipient || mongoose.model("Recipient", recipientSchema);

export default Recipient;
