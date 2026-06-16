import { useState } from "react";

const API_BASE = "http://localhost:5000/students";

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

export function StudentForm({ student, onClose, onSave, toast }) {
  const editing = !!student?.id;
  const [form, setForm] = useState({
    full_name: student?.full_name || "",
    email: student?.email || "",
    age: student?.age || "",
    class: student?.class || "",
    phone: student?.phone || "",
    address: student?.address || "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.age || isNaN(form.age) || form.age < 5 || form.age > 30) e.age = "Age must be between 5 and 30";
    if (!form.class.trim()) e.class = "Class/Grade is required";
    return e;
  };

  const handle = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setSaving(true);
    try {
      if (editing) {
        await api(`/${student.id}`, { method: "PUT", body: JSON.stringify({ full_name: form.full_name, email: form.email, age: Number(form.age) }) });
        toast.success("Student updated successfully");
      } else {
        await api("", { method: "POST", body: JSON.stringify({ full_name: form.full_name, email: form.email, age: Number(form.age) }) });
        toast.success("Student added successfully");
      }
      onSave();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4, color: "var(--color-text-secondary)" }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={handle(key)}
        placeholder={placeholder}
        style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8, border: errors[key] ? "1px solid #e24b4a" : "0.5px solid var(--color-border-secondary)", fontSize: 14, background: "var(--color-background-primary)", color: "var(--color-text-primary)", outline: "none" }}
      />
      {errors[key] && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#e24b4a" }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>{editing ? "Edit student" : "Add student"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: 20, padding: 4 }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div style={{ gridColumn: "1 / -1" }}>{field("Full name *", "full_name", "text", "e.g. Priya Sharma")}</div>
          <div style={{ gridColumn: "1 / -1" }}>{field("Email address *", "email", "email", "e.g. priya@example.com")}</div>
          <div>{field("Age *", "age", "number", "e.g. 17")}</div>
          <div>{field("Class / Grade *", "class", "text", "e.g. 10th, 12-A")}</div>
          <div>{field("Phone", "phone", "tel", "optional")}</div>
          <div>{field("Address", "address", "text", "optional")}</div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "none", cursor: "pointer", fontSize: 14, color: "var(--color-text-primary)" }}>Cancel</button>
          <button onClick={submit} disabled={saving} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#185fa5", color: "#fff", cursor: saving ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 500, opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : editing ? "Save changes" : "Add student"}
          </button>
        </div>
      </div>
    </div>
  );
}
