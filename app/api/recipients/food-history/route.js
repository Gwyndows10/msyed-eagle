import Recipient from "@/models/recipient";

export async function GET() {
  // Fetch all recipients and only the `tookFoodHistory` field
  const recipients = await Recipient.find({}, "tookFoodHistory");

  const foodHistory = {};

  // Loop through each recipient's food history
  recipients.forEach((recipient) => {
    console.log(recipient.tookFoodHistory);
    recipient.tookFoodHistory.forEach((entry) => {
      // Check if the person took food on that date
      
        // Format the date to YYYY-MM-DD (ISO string date)
        const date = entry.date.toISOString().split("T")[0];

        // If it's the first time we've seen this date, initialize it
        if (!foodHistory[date]) {
          foodHistory[date] = 0;
        }

        // Increment the count for this date (person took food on this date)
        foodHistory[date] += 1;
      
    });
  });
  console.log("Food History Data: ", foodHistory);
  // Prepare the chart data to be returned
  const chartData = {
    labels: Object.keys(foodHistory), // Dates
    datasets: [
      {
        label: "Food Taken",
        data: Object.values(foodHistory), // Number of people who took food on each date
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Return the chart data as a JSON response
  return new Response(JSON.stringify(chartData), { status: 200 });
}
