"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const initialState = {
  fullName: "",
  dateOfBirth: "",
  photoIDNumber: "",
  photoIDType: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  dateOfArrivalUSA: "",
  contactPhone: "",
  emailAddress: "",
  monthlyIncome: "",
  foodStamp: "",
  cashAidAmount: "",
  childrenCount: { age0to5: "", age6to18: "" },
  adultsCount: { age18to64: "" },
  ethnicity: "",
  foodPreference: "",
  servicesRequired: {
    foodPackage: "",
    backpacks: "",
    diapers: "",
    counseling: "",
    anyOther: "",
  },
  tookFood: false,
};

export default function UpdateUser() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch(`/api/recipients/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        const user = data.recipient;
        setForm({
          ...initialState,
          ...user,
          childrenCount: { ...initialState.childrenCount, ...user.childrenCount },
          adultsCount: { ...initialState.adultsCount, ...user.adultsCount },
          servicesRequired: { ...initialState.servicesRequired, ...user.servicesRequired },
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchUser();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("childrenCount.")) {
      setForm(f => ({ ...f, childrenCount: { ...f.childrenCount, [name.split(".")[1]]: value } }));
    } else if (name.startsWith("adultsCount.")) {
      setForm(f => ({ ...f, adultsCount: { ...f.adultsCount, [name.split(".")[1]]: value } }));
    } else if (name.startsWith("servicesRequired.")) {
      setForm(f => ({ ...f, servicesRequired: { ...f.servicesRequired, [name.split(".")[1]]: value } }));
    } else if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/recipients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update user");
      router.push("/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <section className="w-full max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Update User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Full Name" className="px-4 py-2 rounded border w-full" />
          <input name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} type="date" placeholder="Date of Birth" className="px-4 py-2 rounded border w-full" />
          <input name="photoIDNumber" value={form.photoIDNumber} onChange={handleChange} placeholder="Photo ID Number" className="px-4 py-2 rounded border w-full" />
          <input name="photoIDType" value={form.photoIDType} onChange={handleChange} placeholder="Photo ID Type" className="px-4 py-2 rounded border w-full" />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="px-4 py-2 rounded border w-full" />
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="px-4 py-2 rounded border w-full" />
          <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="px-4 py-2 rounded border w-full" />
          <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="Zip Code" className="px-4 py-2 rounded border w-full" />
          <input name="dateOfArrivalUSA" value={form.dateOfArrivalUSA} onChange={handleChange} type="date" placeholder="Date of Arrival USA" className="px-4 py-2 rounded border w-full" />
          <input name="contactPhone" value={form.contactPhone} onChange={handleChange} placeholder="Contact Phone" className="px-4 py-2 rounded border w-full" />
          <input name="emailAddress" value={form.emailAddress} onChange={handleChange} type="email" placeholder="Email Address" className="px-4 py-2 rounded border w-full" />
          <input name="monthlyIncome" value={form.monthlyIncome} onChange={handleChange} placeholder="Monthly Income" className="px-4 py-2 rounded border w-full" />
          <input name="foodStamp" value={form.foodStamp} onChange={handleChange} placeholder="Food Stamp" className="px-4 py-2 rounded border w-full" />
          <input name="cashAidAmount" value={form.cashAidAmount} onChange={handleChange} placeholder="Cash Aid Amount" className="px-4 py-2 rounded border w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="childrenCount.age0to5" value={form.childrenCount.age0to5} onChange={handleChange} placeholder="Children Age 0-5" className="px-4 py-2 rounded border w-full" />
          <input name="childrenCount.age6to18" value={form.childrenCount.age6to18} onChange={handleChange} placeholder="Children Age 6-18" className="px-4 py-2 rounded border w-full" />
          <input name="adultsCount.age18to64" value={form.adultsCount.age18to64} onChange={handleChange} placeholder="Adults Age 18-64" className="px-4 py-2 rounded border w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="ethnicity" value={form.ethnicity} onChange={handleChange} placeholder="Ethnicity" className="px-4 py-2 rounded border w-full" />
          <input name="foodPreference" value={form.foodPreference} onChange={handleChange} placeholder="Food Preference" className="px-4 py-2 rounded border w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="servicesRequired.foodPackage" value={form.servicesRequired.foodPackage} onChange={handleChange} placeholder="Food Package" className="px-4 py-2 rounded border w-full" />
          <input name="servicesRequired.backpacks" value={form.servicesRequired.backpacks} onChange={handleChange} placeholder="Backpacks" className="px-4 py-2 rounded border w-full" />
          <input name="servicesRequired.diapers" value={form.servicesRequired.diapers} onChange={handleChange} placeholder="Diapers" className="px-4 py-2 rounded border w-full" />
          <input name="servicesRequired.counseling" value={form.servicesRequired.counseling} onChange={handleChange} placeholder="Counseling" className="px-4 py-2 rounded border w-full" />
          <input name="servicesRequired.anyOther" value={form.servicesRequired.anyOther} onChange={handleChange} placeholder="Any Other" className="px-4 py-2 rounded border w-full" />
        </div>
        <div className="flex items-center gap-2">
          <label className="font-medium">Took Food?</label>
          <input name="tookFood" type="checkbox" checked={form.tookFood} onChange={handleChange} />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="px-6 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition" disabled={loading}>
          {loading ? "Updating..." : "Update User"}
        </button>
      </form>
    </section>
  );
} 