
import connectMongoDB from "@/libs/mongodb";
import Recipient from "@/models/recipient";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { fullName, ID } = await request.json();
    await connectMongoDB();
    await Recipient.create({ fullName, ID });
    return NextResponse.json({ message: "Recipient Added" }, { status: 201 });
} 

export async function GET(){
    await connectMongoDB();
    const recipients = await Recipient.find();
    return NextResponse.json({ recipients });
}

export async function DELETE(request){
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await Recipient.findByIdAndDelete(id);
    return NextResponse.json({message: "Recipient deleted"}, {status: 200});
}
