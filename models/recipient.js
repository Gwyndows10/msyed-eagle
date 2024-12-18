import mongoose, { Schema } from "mongoose";

const recipientSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    /*ID: {
      type: String,
      required: false,
      unique: true,
    }*/
    dateOfBirth: {
      type: Date,
      required: true,
    },
    photoIDNumber: {
      type: String,
      required: true,
    },
    photoIDType: {
      type: String,
      enum: ["DL", "Passport", "I-94", "EAD", "Other"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    dateOfArrivalUSA: {
      type: Date,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
    },
    monthlyIncome: {
      type: Number,
    },
    foodStamp: {
      type: Boolean,
    },
    cashAidAmount: {
      type: Number,
    },
    childrenCount: {
      age0to5: { type: Number, },
      age6to18: { type: Number, },
    },
    adultsCount: {
      age18to64: { type: Number, },
    },
    ethnicity: {
      type: String,
    },
    foodPreference: {
      type: String,
      enum: ["Halal", "Vegetarian", "Other"]
    },
    servicesRequired: {
      foodPackage: { type: String },
      backpacks: { type: String },
      diapers: { type: String },
      counseling: { type: String },
      anyOther: { type: String },
    },
    tookFood: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Recipient =
  mongoose.models.Recipient || mongoose.model("Recipient", recipientSchema);

export default Recipient;
