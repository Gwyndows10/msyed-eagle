import connectMongoDB from "@/libs/mongodb";
import Recipient from "@/models/recipient";
import { NextResponse } from "next/server";

export async function PUT(request, { params }){
    const { id } = await params;
    const {newFullName: fullName, newID: ID, newEmailAddress: emailAddress, newGender: gender, newDateOfBirth: dateOfBirth, newRegistrationDate: registrationDate } = await request.json();
    await connectMongoDB();
    await Recipient.findByIdAndUpdate(id, {fullName, ID, emailAddress, gender, dateOfBirth, registrationDate});
    return NextResponse.json({message: "recipient updated"}, {status: 200});
}

export async function GET(request, {params}){
    const {id} = await params;
    await connectMongoDB();
    const recipient = await Recipient.findOne({_id: id});
    return NextResponse.json({recipient}, {status: 200})
}