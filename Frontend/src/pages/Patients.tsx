import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import "./Patients.css";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  dob: string;
  medicalHistory?: any[];
  appointments?: any[];
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE_URL = "http://localhost:8000/patients";

  // Utility function to handle errors
  const handleApiError = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      return err.response?.data?.detail || err.message || "API request failed";
    } else if (err instanceof Error) {
      return err.message;
    }
    return "An unknown error occurred";
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Patient[]>(API_BASE_URL, {
        params: { name: searchTerm }
      });
      setPatients(res.data);
      setError("");
    } catch (err) {
      setError(handleApiError(err));
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, form);
      } else {
        await axios.post(API_BASE_URL, form);
      }
      setForm({ name: "", email: "", phone: "", dob: "" });
      setEditingId(null);
      await fetchPatients();
    } catch (err) {
      setError(handleApiError(err));
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient: Patient) => {
    setForm({
      name: patient.name,
      email: patient.email,
      phone: patient.phone || "",
      dob: patient.dob,
    });
    setEditingId(patient.id);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/${id}`);
        await fetchPatients();
      } catch (err) {
        setError(handleApiError(err));
        console.error("Deletion error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="patients-container">
      <header className="patients-header">
        <h1 className="patients-title">Patient Management</h1>
        <p className="patients-subtitle">Manage patient records</p>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError("")} className="dismiss-btn">
            ×
          </button>
        </div>
      )}

      <div className="patients-content">
        <section className="patients-form-section">
          <h2 className="section-title">
            {editingId ? "Edit Patient" : "Add New Patient"}
          </h2>
          <form onSubmit={handleSubmit} className="patients-form">
            <div className="form-group">
              <label htmlFor="name">Full Name*</label>
              <input
                id="name"
                name="name"
                placeholder="Patient Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="patient@example.com"
                value={form.email}
                onChange={handleChange}
                required
                disabled={!!editingId}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth*</label>
              <input
                id="dob"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : editingId ? "Update Patient" : "Add Patient"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setForm({ name: "", email: "", phone: "", dob: "" });
                    setEditingId(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="patients-list-section">
          <div className="section-header">
            <h2 className="section-title">Patient Records</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
              <span className="patient-count">{patients.length} patients</span>
            </div>
          </div>

          {loading && patients.length === 0 ? (
            <div className="loading">Loading patients...</div>
          ) : patients.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👨‍⚕️</div>
              <p>No patient records found</p>
              <button 
                onClick={fetchPatients} 
                className="refresh-btn"
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="patients-table-container">
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date of Birth</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.name}</td>
                      <td>{patient.email}</td>
                      <td>{patient.phone || "-"}</td>
                      <td>{new Date(patient.dob).toLocaleDateString()}</td>
                      <td className="actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(patient)}
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(patient.id)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}