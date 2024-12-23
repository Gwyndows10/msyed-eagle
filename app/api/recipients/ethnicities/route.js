import connectMongoDB from "@/libs/mongodb";
import Recipient from "@/models/recipient";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  await connectMongoDB();
    
  try {
    const ethnicityData = await Recipient.aggregate([
      { $group: { _id: "$ethnicity", count: { $sum: 1 } } },
      //{ $sort: { count: -1 } },
    ]);

    return NextResponse.json(ethnicityData, {status: 200});
  } catch (error) {
    return NextResponse.json(
        { error: "Failed to fetch ethnicities" },
        { status: 500 }
      );
  }
}
