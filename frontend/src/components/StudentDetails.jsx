import { useState, useCallback, useEffect } from "react";
import { Avatar } from "./ui/Avatar.jsx";
import { Badge } from "./ui/Badge.jsx";
import { Spinner } from "./ui/Spinner.jsx";

const API_BASE = "http://localhost:5000/students";
const SUBJECTS = ["Math", "Science", "English", "History", "Computer Science", "Physics", "Chemistry", "Geography"];

function api(path, options = {}) {
  return fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || "Request failed");
    return data;
  });
}

function gradeColor(marks) {
  if (marks >= 90) return "green";
  if (marks >= 75) return "teal";
  if (marks >= 60) return "blue";
  if (marks >= 45) return "amber";
  return "red";
}

function gradeLabel(marks) {
  if (marks >= 90) return "A+";
  if (marks >= 75) return "A";
  if (marks >= 60) return "B";
  if (marks >= 45) return "C";
  return "F";
}

export function StudentDetails({ studentId, onClose, onEdit, onAddMarks, toast }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marks, setMarks] = useState([{ subject: "", marks: "" }]);
  const [savingMarks, setSavingMarks] = useState(false);
  const [marksErrors, setMarksErrors] = useState([]);
  const [showMarksForm, setShowMarksForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api(`/${studentId}`);
      setStudent(data.data || data);
    } catch (err) {
      toast.error(err.message);
      onClose();
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    load();
  }, [load]);

  const avg = student?.marks?.length
    ? Math.round(student.marks.reduce((s, m) => s + Number(m.marks), 0) / student.marks.length)
    : null;

  const addRow = () => setMarks((m) => [...m, { subject: "", marks: "" }]);
  const removeRow = (i) => setMarks((m) => m.filter((_, idx) => idx !== i));
  const updateMark = (i, k, v) => setMarks((m) => m.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  const submitMarks = async () => {
    const errs = marks.map((m) => {
      if (!m.subject) return "Subject required";
      if (!m.marks || isNaN(m.marks) || m.marks < 0 || m.marks > 100) return "Marks must be 0–100";
      return null;
    });
    if (errs.some(Boolean)) return setMarksErrors(errs);
    setSavingMarks(true);
    try {
      for (const row of marks) {
        await api(`/${student.id}/marks`, {
          method: "POST",
          body: JSON.stringify({ subject: row.subject, marks: Number(row.marks) }),
        });
      }
      toast.success(`Marks added for ${student.full_name}`);
      setMarks([{ subject: "", marks: "" }]);
      setShowMarksForm(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingMarks(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>Student details</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: 20, padding: 4 }}>✕</button>
        </div>
        {loading ? <Spinner /> : student && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: "16px", background: "var(--color-background-secondary)", borderRadius: 10 }}>
              <Avatar name={student.full_name} size={52} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>{student.full_name}</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>{student.email}</p>
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    <Badge label={`Age: ${student.age}`} color="blue" />

                    {avg !== null && (
                      <Badge
                        label={`Average: ${avg}%`}
                        color={gradeColor(avg)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>



            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Marks ({student.marks?.length || 0})</h3>
              <button
                onClick={() => setShowMarksForm(!showMarksForm)}
                style={{ fontSize: 13, color: "#185fa5", background: "none", border: "0.5px solid #185fa5", borderRadius: 6, padding: "5px 12px", cursor: "pointer" }}
              >
                {showMarksForm ? "Cancel" : "+ Add marks"}
              </button>
            </div>

            {showMarksForm && (
              <div style={{ marginBottom: 16, padding: 12, background: "var(--color-background-secondary)", borderRadius: 8 }}>
                {marks.map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 32px", gap: 8, marginBottom: 8, alignItems: "start" }}>
                    <select
                      value={row.subject}
                      onChange={(e) => { updateMark(i, "subject", e.target.value); setMarksErrors((er) => er.map((e, idx) => idx === i ? null : e)); }}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: marksErrors[i] && !row.subject ? "1px solid #e24b4a" : "0.5px solid var(--color-border-secondary)", fontSize: 14, background: "var(--color-background-primary)", color: "var(--color-text-primary)" }}
                    >
                      <option value="">Subject…</option>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="Score"
                      value={row.marks}
                      onChange={(e) => { updateMark(i, "marks", e.target.value); setMarksErrors((er) => er.map((e, idx) => idx === i ? null : e)); }}
                      style={{ padding: "9px 12px", borderRadius: 8, border: marksErrors[i] && row.subject ? "1px solid #e24b4a" : "0.5px solid var(--color-border-secondary)", fontSize: 14, background: "var(--color-background-primary)", color: "var(--color-text-primary)", width: "100%", boxSizing: "border-box" }}
                    />
                    {marks.length > 1 && (
                      <button onClick={() => removeRow(i)} style={{ height: 38, border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, background: "none", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: 16 }}>✕</button>
                    )}
                    {marksErrors[i] && <p style={{ gridColumn: "1 / -1", margin: 0, fontSize: 12, color: "#e24b4a" }}>{marksErrors[i]}</p>}
                  </div>
                ))}
                <button onClick={addRow} style={{ fontSize: 13, color: "#185fa5", background: "none", border: "none", cursor: "pointer", padding: "4px 0", marginBottom: 8 }}>+ Add another subject</button>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setShowMarksForm(false)} style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "none", cursor: "pointer", fontSize: 13 }}>Cancel</button>
                  <button onClick={submitMarks} disabled={savingMarks} style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "none", background: "#185fa5", color: "#fff", cursor: savingMarks ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 500, opacity: savingMarks ? 0.7 : 1 }}>{savingMarks ? "Saving…" : "Save marks"}</button>
                </div>
              </div>
            )}

            {!student.marks?.length ? (
              <p style={{ color: "var(--color-text-secondary)", fontSize: 14, textAlign: "center", padding: "1rem" }}>No marks recorded yet</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {student.marks.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--color-background-secondary)", borderRadius: 8 }}>
                    <span style={{ fontSize: 14, color: "var(--color-text-primary)" }}>{m.subject}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 500 }}>{m.marks}</span>
                      <Badge label={gradeLabel(m.marks)} color={gradeColor(m.marks)} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button
                onClick={() => onEdit(student)}
                style={{ padding: "9px 18px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "none", cursor: "pointer", fontSize: 14, color: "var(--color-text-primary)" }}
              >
                Edit student
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
