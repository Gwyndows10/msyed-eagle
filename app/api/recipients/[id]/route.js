import connectMongoDB from "@/libs/mongodb";
import Recipient from "@/models/recipient";
import { NextResponse } from "next/server";
//import fetchHelpers from "";

export async function PUT(request, { params }) {
    const { id } = await params; 
    const { fullName, ID, emailAddress, gender, dateOfBirth, registrationDate, tookFood } = await request.json();
    
    await connectMongoDB();
    console.log("got here!");
    
    const recipient = await Recipient.findById(id);
    if (!recipient) {
        return NextResponse.json({ message: "Recipient not found" }, { status: 404 });
    }

    await Recipient.findByIdAndUpdate(id, { fullName, ID, emailAddress, gender, dateOfBirth, registrationDate, tookFood });
    console.log(tookFood);
    return NextResponse.json({ message: "Recipient updated successfully" }, { status: 200 });
}


export async function GET(request, {params}){
    const {id} = await params;
    await connectMongoDB();
    const recipient = await Recipient.findOne({_id: id});
    return NextResponse.json({recipient}, {status: 200})
}