import { useEffect, useState } from "react";
import axios from "axios";
import "./Appointments.css";

interface Patient {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface Appointment {
  id: number;
  dateTime: string;
  status: string;
  patient?: Patient;
  doctor?: Doctor;
}

interface AppointmentForm {
  patientId: string;
  doctorId: string;
  dateTime: string;
  status: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState<AppointmentForm>({
    patientId: "",
    doctorId: "",
    dateTime: "",
    status: "Scheduled",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const API_BASE_URL = "http://localhost:8000/appointments";
  const PATIENTS_URL = "http://localhost:8000/patients";
  const DOCTORS_URL = "http://localhost:8000/doctors";

  const handleApiError = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      return err.response?.data?.detail || err.message || "API request failed";
    } else if (err instanceof Error) {
      return err.message;
    }
    return "An unknown error occurred";
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
        axios.get<Appointment[]>(API_BASE_URL, { params: { search: searchTerm } }),
        axios.get<Patient[]>(PATIENTS_URL),
        axios.get<Doctor[]>(DOCTORS_URL),
      ]);
      setAppointments(appointmentsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
      setError("");
    } catch (err) {
      setError(handleApiError(err));
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId || !form.doctorId || !form.dateTime) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        patientId: parseInt(form.patientId),
        doctorId: parseInt(form.doctorId),
        dateTime: new Date(form.dateTime).toISOString(),
        status: form.status,
      };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, payload);
      } else {
        await axios.post(API_BASE_URL, payload);
      }

      setForm({
        patientId: "",
        doctorId: "",
        dateTime: "",
        status: "Scheduled",
      });
      setEditingId(null);
      await fetchData();
    } catch (err) {
      setError(handleApiError(err));
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setForm({
      patientId: appointment.patient?.id.toString() || "",
      doctorId: appointment.doctor?.id.toString() || "",
      dateTime: appointment.dateTime.slice(0, 16),
      status: appointment.status,
    });
    setEditingId(appointment.id);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/${id}`);
        await fetchData();
      } catch (err) {
        setError(handleApiError(err));
        console.error("Deletion error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="appointments-container">
      <header className="appointments-header">
        <h1 className="appointments-title">Appointment Management</h1>
        <p className="appointments-subtitle">Manage patient appointments</p>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError("")} className="dismiss-btn">×</button>
        </div>
      )}

      <div className="appointments-content">
        <section className="appointments-form-section">
          <h2 className="section-title">
            {editingId ? "Edit Appointment" : "Create New Appointment"}
          </h2>
          <form onSubmit={handleSubmit} className="appointments-form">
            <div className="form-group">
              <label htmlFor="patientId">Patient*</label>
              <select
                id="patientId"
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="doctorId">Doctor*</label>
              <select
                id="doctorId"
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} ({doctor.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dateTime">Date & Time*</label>
              <input
                id="dateTime"
                name="dateTime"
                type="datetime-local"
                value={form.dateTime}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setForm({
                      patientId: "",
                      doctorId: "",
                      dateTime: "",
                      status: "Scheduled",
                    });
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

        <section className="appointments-list-section">
          <div className="section-header">
            <h2 className="section-title">Appointment List</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
              <span className="appointment-count">
                {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {loading && appointments.length === 0 ? (
            <div className="loading">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <p>No appointments found</p>
              <button onClick={fetchData} className="refresh-btn" disabled={loading}>
                Refresh
              </button>
            </div>
          ) : (
            <div className="appointments-table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.patient?.name || "N/A"}</td>
                      <td>
                        {appointment.doctor?.name || "N/A"}
                        {appointment.doctor?.specialization && (
                          <span className="specialization"> ({appointment.doctor.specialization})</span>
                        )}
                      </td>
                      <td>{formatDateTime(appointment.dateTime)}</td>
                      <td>
                        <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(appointment)}
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(appointment.id)}
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