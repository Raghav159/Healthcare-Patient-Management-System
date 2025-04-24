import { useEffect, useState } from "react";
import axios from "axios";
import "./Doctors.css";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  contact: string;
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    contact: ""
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE_URL = "http://localhost:8000/doctors";

  const handleApiError = (err: unknown): string => {
    // Type guard for Axios error (no need to import AxiosError)
    if (typeof err === 'object' && err !== null && 'isAxiosError' in err) {
      const axiosError = err as { isAxiosError: boolean, response?: { data?: { detail?: string } }, message?: string };
      return axiosError.response?.data?.detail || axiosError.message || "API request failed";
    } else if (err instanceof Error) {
      return err.message;
    }
    return "An unknown error occurred";
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Doctor[]>(API_BASE_URL, {
        params: { name: searchTerm }
      });
      setDoctors(res.data);
      setError("");
    } catch (err) {
      setError(handleApiError(err));
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
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
      setForm({ name: "", specialization: "", contact: "" });
      setEditingId(null);
      await fetchDoctors();
    } catch (err) {
      setError(handleApiError(err));
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      contact: doctor.contact
    });
    setEditingId(doctor.id);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/${id}`);
        await fetchDoctors();
      } catch (err) {
        setError(handleApiError(err));
        console.error("Deletion error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="doctors-container">
      <header className="doctors-header">
        <h1 className="doctors-title">Doctor Management</h1>
        <p className="doctors-subtitle">Manage doctor records</p>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError("")} className="dismiss-btn">
            ×
          </button>
        </div>
      )}

      <div className="doctors-content">
        <section className="doctors-form-section">
          <h2 className="section-title">
            {editingId ? "Edit Doctor" : "Add New Doctor"}
          </h2>
          <form onSubmit={handleSubmit} className="doctors-form">
            <div className="form-group">
              <label htmlFor="name">Full Name*</label>
              <input
                id="name"
                name="name"
                placeholder="Doctor Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialization">Specialization*</label>
              <input
                id="specialization"
                name="specialization"
                placeholder="Cardiology, Neurology, etc."
                value={form.specialization}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact">Contact Number*</label>
              <input
                id="contact"
                name="contact"
                type="tel"
                placeholder="Phone number"
                value={form.contact}
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
                {loading ? "Saving..." : editingId ? "Update Doctor" : "Add Doctor"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setForm({ name: "", specialization: "", contact: "" });
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

        <section className="doctors-list-section">
          <div className="section-header">
            <h2 className="section-title">Doctor Records</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
              <span className="doctor-count">{doctors.length} doctors</span>
            </div>
          </div>

          {loading && doctors.length === 0 ? (
            <div className="loading">Loading doctors...</div>
          ) : doctors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👨‍⚕️</div>
              <p>No doctor records found</p>
              <button 
                onClick={fetchDoctors} 
                className="refresh-btn"
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="doctors-table-container">
              <table className="doctors-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td>{doctor.name}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.contact}</td>
                      <td className="actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(doctor)}
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(doctor.id)}
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