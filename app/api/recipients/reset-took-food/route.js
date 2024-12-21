import connectMongoDB from '@/libs/mongodb';
import Recipient from '@/models/recipient';// Ensure this import is correct
import { NextResponse } from "next/server";

export async function PUT(request) {
  await connectMongoDB();

  try {
    const result = await Recipient.updateMany(
      {},  
      { $set: { tookFood: false } }  
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json(
        { message: "TookFood status reset for all users." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No users were updated." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error resetting tookFood:", error);
    return NextResponse.json(
      { error: "Failed to reset tookFood for all users" },
      { status: 500 }
    );
  }
}
