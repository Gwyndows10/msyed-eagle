import mongoose, { Schema } from "mongoose";

const recipientSchema = new Schema(
    {
        fullName: String,
        ID: String,
    }, 
    {
        timestamps: true,
    }
);

const Recipient = mongoose.models.Recipient || mongoose.model("Recipient", recipientSchema);

export default Recipient; 
