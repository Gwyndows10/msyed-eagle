import connectMongoDB from "@/libs/mongodb";
import Recipient from "@/models/recipient";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();
  console.log("Incoming Request Data:", data);

  const {
    fullName,
    ID,
    dateOfBirth,
    photoIDNumber,
    photoIDType,
    address,
    city,
    state,
    zipCode,
    dateOfArrivalUSA,
    contactPhone,
    emailAddress,
    monthlyIncome,
    foodStamp,
    cashAidAmount,
    childrenCount,
    adultsCount,
    ethnicity,
    foodPreference,
    servicesRequired,
    tookFood,
  } = data;

  await connectMongoDB();

    const formattedDateOfBirth = new Date(dateOfBirth);
    const formattedDateOfArrivalUSA = dateOfArrivalUSA ? new Date(dateOfArrivalUSA) : null;

    if (isNaN(formattedDateOfBirth) || (dateOfArrivalUSA && isNaN(formattedDateOfArrivalUSA))) {
      return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
    }

    await Recipient.create({
      fullName,
      ID,
      dateOfBirth: formattedDateOfBirth,
      photoIDNumber,
      photoIDType,
      address,
      city,
      state,
      zipCode,
      dateOfArrivalUSA: formattedDateOfArrivalUSA,
      contactPhone,
      emailAddress,
      monthlyIncome,
      foodStamp,
      cashAidAmount,
      childrenCount: {
        age0to5: childrenCount?.age0to5 || 0,
        age6to18: childrenCount?.age6to18 || 0,
      },
      adultsCount: {
        age18to64: adultsCount?.age18to64 || 0,
      },
      ethnicity,
      foodPreference,
      servicesRequired: {
        foodPackage: servicesRequired?.foodPackage || "",
        backpacks: servicesRequired?.backpacks || "",
        diapers: servicesRequired?.diapers || "",
        counseling: servicesRequired?.counseling || "",
        anyOther: servicesRequired?.anyOther || "",
      },
      tookFood,
    });

    return NextResponse.json({ message: "Recipient Added" }, { status: 201 });
  
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
  
    const fullName = searchParams.get("fullName");
    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    //const registrationDate = searchParams.get("registration_date");
  
    await connectMongoDB();
  
    let filter = {};
  
    if (fullName) filter.fullName = { $regex: fullName, $options: "i" };
    if (id) filter.ID = id;
    if (email) filter.emailAddress = { $regex: email, $options: "i" };
    if (phone) filter.contactPhone = { $regex: phone, $options: "i" };
    //if (registrationDate) filter.registrationDate = { $gte: new Date(registrationDate) };
  
    try {
      const recipients = await Recipient.find(filter);
      console.log("Filtered Recipients:", recipients);
  
      return NextResponse.json({ recipients }, { status: 200 });
    } catch (error) {
      console.error("Error fetching recipients:", error);
      return NextResponse.json({ error: "Failed to fetch recipients" }, { status: 500 });
    }
  }
  

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");

  await connectMongoDB();

  try {
    const deletedRecipient = await Recipient.findByIdAndDelete(id);
    if (!deletedRecipient) {
      return NextResponse.json({ message: "Recipient not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Recipient deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting recipient:", error);
    return NextResponse.json({ error: "Failed to delete recipient" }, { status: 500 });
  }
}
