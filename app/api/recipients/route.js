
import connectMongoDB from "@/libs/mongodb";
import Recipient from "@/models/recipient";
import { NextResponse } from "next/server";

export async function POST(request) {
    const data = await request.json();
    console.log("Incoming Request Data:", data);
    const { fullName, ID, emailAddress, gender, dateOfBirth, registrationDate, tookFood } = data;
    await connectMongoDB();
    
    const formattedDateOfBirth = new Date(dateOfBirth);
    const formattedRegistrationDate = new Date(registrationDate);
    if (isNaN(formattedDateOfBirth) || isNaN(formattedRegistrationDate)) {
        return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
    }

    await Recipient.create({
      fullName,
      ID,
      emailAddress,
      gender,
      dateOfBirth: formattedDateOfBirth,
      registrationDate: formattedRegistrationDate,
      tookFood,
    });
    return NextResponse.json({ message: "Recipient Added" }, { status: 201 });
} 

/*export async function GET(){
    await connectMongoDB();
    const recipients = await Recipient.find();
    //console.log(recipients);
    return NextResponse.json({ recipients });
}*/
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const id = searchParams.get('id');
    const gender = searchParams.get('gender');
    const registrationDate = searchParams.get('registration_date');

    await connectMongoDB();

    let filter = {};

    if (name) filter.fullName = { $regex: name, $options: 'i' };  
    if (id) filter.ID = id;
    if (gender) filter.gender = gender;
    if (registrationDate) filter.registrationDate = { $gte: new Date(registrationDate) };

    try {
        const recipients = await Recipient.find(filter);
        console.log("Filtered Recipients:", recipients);

        return NextResponse.json({ recipients }, { status: 200 });
    } catch (error) {
        console.error('Error fetching recipients:', error);
        return NextResponse.json({ error: 'Failed to fetch recipients' }, { status: 500 });
    }
}

export async function DELETE(request){
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await Recipient.findByIdAndDelete(id);
    return NextResponse.json({message: "Recipient deleted"}, {status: 200});
}
