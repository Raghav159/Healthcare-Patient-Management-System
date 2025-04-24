import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import "./MedicalHistories.css";

interface MedicalHistory {
  id: number;
  diagnosis: string;
  treatment: string | null;
  date: string;
  patient: {
    id: number;
    name: string;
  };
}

interface Patient {
  id: number;
  name: string;
}

interface MedicalHistoryForm {
  patientId: string;
  diagnosis: string;
  treatment: string;
  date: string;
}

export default function MedicalHistories() {
  const [histories, setHistories] = useState<MedicalHistory[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [form, setForm] = useState<MedicalHistoryForm>({
    patientId: "",
    diagnosis: "",
    treatment: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApiError = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{ detail?: string }>;
      return axiosError.response?.data?.detail || axiosError.message || "API request failed";
    } else if (err instanceof Error) {
      return err.message;
    }
    return "An unknown error occurred";
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Patient[]>("http://localhost:8000/patients");
        setPatients(res.data);
        setError("");
      } catch (err) {
        setError(handleApiError(err));
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      fetchHistories(selectedPatientId);
    }
  }, [selectedPatientId]);

  const fetchHistories = async (patientId: string) => {
    try {
      setLoading(true);
      const res = await axios.get<MedicalHistory[]>(
        `http://localhost:8000/medical-histories/patient/${patientId}`
      );
      setHistories(res.data);
      setError("");
    } catch (err) {
      setError(handleApiError(err));
      console.error("Error fetching histories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId || !form.diagnosis || !form.date) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/medical-histories", {
        ...form,
        patientId: parseInt(form.patientId),
      });
      setForm({ patientId: "", diagnosis: "", treatment: "", date: "" });
      fetchHistories(form.patientId);
      setError("");
    } catch (err) {
      setError(handleApiError(err));
      console.error("Error submitting history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="medical-histories-container">
      <header className="medical-histories-header">
        <h1 className="medical-histories-title">Patient Medical Histories</h1>
        <p className="medical-histories-subtitle">Manage and review patient medical records</p>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError("")} className="dismiss-btn">×</button>
        </div>
      )}

      <div className="medical-histories-content">
        <section className="patient-selection-section">
          <h2 className="section-title">Select Patient</h2>
          <select
            id="patientSelect"
            name="patientId"
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              setForm({ ...form, patientId: e.target.value });
            }}
            className="patient-select"
            disabled={loading}
          >
            <option value="">-- Choose a patient --</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </section>

        {selectedPatientId && (
          <>
            <section className="add-history-section">
              <h2 className="section-title">Add New Medical Record</h2>
              <form onSubmit={handleSubmit} className="medical-history-form">
                <div className="form-group">
                  <label htmlFor="diagnosis">Diagnosis*</label>
                  <input
                    id="diagnosis"
                    name="diagnosis"
                    placeholder="Enter diagnosis"
                    value={form.diagnosis}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="treatment">Treatment</label>
                  <input
                    id="treatment"
                    name="treatment"
                    placeholder="Enter treatment details"
                    value={form.treatment}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date*</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Saving..." : "Add Medical Record"}
                </button>
              </form>
            </section>

            <section className="histories-list-section">
              <h2 className="section-title">Medical History</h2>
              {loading && histories.length === 0 ? (
                <div className="loading">Loading medical histories...</div>
              ) : histories.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <p>No medical records found for this patient</p>
                </div>
              ) : (
                <ul className="histories-list">
                  {histories.map((history) => (
                    <li key={history.id} className="history-card">
                      <div className="history-date">{formatDate(history.date)}</div>
                      <div className="history-diagnosis">
                        <strong>Diagnosis:</strong> {history.diagnosis}
                      </div>
                      {history.treatment && (
                        <div className="history-treatment">
                          <strong>Treatment:</strong> {history.treatment}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}