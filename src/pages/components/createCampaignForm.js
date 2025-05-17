// components/campaign/CreateCampaignForm.js
import React, { useState } from "react";

export default function CreateCampaignForm() {
  const [form, setForm] = useState({
    campaign_name: "",
    start_date: "",
    end_date: "",
    loyalty_token_id: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await fetch("/api/create-campaign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
  };

  return (
    <div className="p-4 bg-gray-900 text-white space-y-2">
      <input name="campaign_name" placeholder="Campaign Name" onChange={handleChange} className="w-full p-2 bg-gray-700" />
      <input name="start_date" type="date" onChange={handleChange} className="w-full p-2 bg-gray-700" />
      <input name="end_date" type="date" onChange={handleChange} className="w-full p-2 bg-gray-700" />
      <input name="loyalty_token_id" placeholder="Token ID" onChange={handleChange} className="w-full p-2 bg-gray-700" />
      <button onClick={handleSubmit} className="bg-green-600 px-4 py-2 rounded">Create</button>
    </div>
  );
}
