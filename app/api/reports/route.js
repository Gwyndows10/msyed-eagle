import connectMongoDB from "@/libs/mongodb";
import Recipient from "@/models/recipient";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const reportType = searchParams.get("type");

  await connectMongoDB();

  try {
    let result;

    switch (reportType) {
      case "tookFood":
        result = await Recipient.aggregate([
          {
            $group: {
              _id: "$tookFood",
              count: { $sum: 1 },
            },
          },
        ]);
        break;

      case "gender":
        result = await Recipient.aggregate([
          {
            $group: {
              _id: "$gender",
              count: { $sum: 1 },
            },
          },
        ]);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid report type" },
          { status: 400 }
        );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
