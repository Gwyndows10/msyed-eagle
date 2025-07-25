export default function ReportsPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-8">
      <h1 className="text-3xl font-bold">Reports</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-xl">
        Access and generate detailed reports to gain insights into recipients, food distribution, and more.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <a href="/reports/ethnicities" className="px-6 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Ethnicities Report</a>
        <a href="/reports/foodQuantity" className="px-6 py-3 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition">Food Quantity Report</a>
      </div>
    </section>
  );
} 