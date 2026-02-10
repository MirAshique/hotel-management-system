import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const AdminSettings = () => {
  const [form, setForm] = useState({
    hotelName: "",
    email: "",
    phone: "",
    address: "",
    cancellationPolicy: "",
    taxPercentage: 0,
    rules: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH SETTINGS ================= */
  const fetchSettings = async () => {
    try {
      const res = await axios.get("/settings");
      setForm(res.data.settings); // ✅ FIXED
    } catch {
      alert("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  /* ================= SAVE SETTINGS ================= */
  const saveSettings = async () => {
    setSaving(true);
    try {
      await axios.put("/settings", form);
      alert("Settings updated successfully");
    } catch {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="container">Loading settings...</p>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Hotel Settings</h2>
        <p>Manage hotel information & policies</p>
      </div>

      <div className="settings-card">
        <div className="settings-grid">
          <input
            placeholder="Hotel Name"
            value={form.hotelName}
            onChange={(e) =>
              setForm({ ...form, hotelName: e.target.value })
            }
          />

          <input
            placeholder="Contact Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            placeholder="Hotel Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
        </div>

        <textarea
          placeholder="Cancellation Policy"
          value={form.cancellationPolicy}
          onChange={(e) =>
            setForm({
              ...form,
              cancellationPolicy: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Hotel Rules"
          value={form.rules}
          onChange={(e) =>
            setForm({ ...form, rules: e.target.value })
          }
        />

        <button
          className="btn"
          onClick={saveSettings}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
