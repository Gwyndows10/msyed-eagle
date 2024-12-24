import connectMongoDB from "@/libs/mongodb";
import Recipient from "@/models/recipient";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = await params;

  const {
    fullName,
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
  } = await request.json();

  await connectMongoDB();

  try {
    const recipient = await Recipient.findById(id);
    if (!recipient) {
      return NextResponse.json(
        { message: "Recipient not found" },
        { status: 404 }
      );
    }

    const tookFoodChanged = recipient.tookFood !== tookFood;
    const isFoodTakenNow = tookFood === true;
    const wasFoodNotTakenPreviously = recipient.tookFood === false;

    const updateData = {
      fullName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : recipient.dateOfBirth,
      photoIDNumber,
      photoIDType,
      address,
      city,
      state,
      zipCode,
      dateOfArrivalUSA: dateOfArrivalUSA ? new Date(dateOfArrivalUSA) : recipient.dateOfArrivalUSA,
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
    };

    await Recipient.findByIdAndUpdate(id, updateData);

    if (tookFoodChanged && isFoodTakenNow && wasFoodNotTakenPreviously) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      const existingHistory = recipient.tookFoodHistory.find(
        (entry) => new Date(entry.date).setHours(0, 0, 0, 0) === today.getTime()
      );

      if (!existingHistory) {
        await Recipient.findByIdAndUpdate(id, {
          $push: {
            tookFoodHistory: {
              date: today,  
              status: tookFood,  
            },
          },
        });
      }
    }
    

    return NextResponse.json(
      { message: "Recipient updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating recipient:", error);
    return NextResponse.json(
      { error: "Failed to update recipient" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  const { id } = await params;

  await connectMongoDB();

  try {
    const recipient = await Recipient.findById(id);

    if (!recipient) {
      return NextResponse.json(
        { message: "Recipient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ recipient }, { status: 200 });
  } catch (error) {
    console.error("Error fetching recipient:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipient" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  await connectMongoDB();

  try {
    const recipient = await Recipient.findById(id);

    if (!recipient) {
      return NextResponse.json(
        { message: "Recipient not found" },
        { status: 404 }
      );
    }

    await Recipient.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Recipient deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting recipient:", error);
    return NextResponse.json(
      { error: "Failed to delete recipient" },
      { status: 500 }
    );
  }
}
