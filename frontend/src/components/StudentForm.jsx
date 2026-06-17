import { useState } from "react";

const API_BASE = "http://localhost:5000/students";

function api(path, options = {}) {
  return fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }).then(async (res) => {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Request failed"
      );
    }

    return data;
  });
}

export function StudentForm({
  student,
  onClose,
  onSave,
  toast,
}) {
  const editing = !!student?.id;

  const [form, setForm] = useState({
    full_name: student?.full_name || "",
    email: student?.email || "",
    age: student?.age || "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};

    if (!form.full_name.trim()) {
      e.full_name = "Name is required";
    }

    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      e.email = "Enter a valid email";
    }

    if (
      !form.age ||
      isNaN(form.age) ||
      Number(form.age) <= 0
    ) {
      e.age = "Age must be greater than 0";
    }

    return e;
  };

  const handleChange = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

    if (errors[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: undefined,
      }));
    }
  };

  const submit = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);

    try {
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        age: Number(form.age),
      };

      if (editing) {
        await api(`/${student.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        toast.success(
          "Student updated successfully"
        );
      } else {
        await api("", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        toast.success(
          "Student added successfully"
        );
      }

      onSave();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const field = (
    label,
    key,
    type = "text",
    placeholder = ""
  ) => (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 500,
          marginBottom: 4,
          color:
            "var(--color-text-secondary)",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={form[key]}
        onChange={handleChange(key)}
        placeholder={placeholder}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "9px 12px",
          borderRadius: 8,
          border: errors[key]
            ? "1px solid #e24b4a"
            : "0.5px solid var(--color-border-secondary)",
          fontSize: 14,
          background:
            "var(--color-background-primary)",
          color:
            "var(--color-text-primary)",
          outline: "none",
        }}
      />

      {errors[key] && (
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 12,
            color: "#e24b4a",
          }}
        >
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background:
            "var(--color-background-primary)",
          borderRadius: 12,
          border:
            "0.5px solid var(--color-border-tertiary)",
          width: "100%",
          maxWidth: 480,
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            {editing
              ? "Edit Student"
              : "Add Student"}
          </h2>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color:
                "var(--color-text-secondary)",
              fontSize: 20,
            }}
          >
            ✕
          </button>
        </div>

        {field(
          "Full Name *",
          "full_name",
          "text",
          "e.g. Aman Sharma"
        )}

        {field(
          "Email Address *",
          "email",
          "email",
          "e.g. aman@gmail.com"
        )}

        {field(
          "Age *",
          "age",
          "number",
          "e.g. 22"
        )}

        <div
          style={{
            display: "flex",
            justifyContent:
              "flex-end",
            gap: 10,
            marginTop: 12,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              border:
                "0.5px solid var(--color-border-secondary)",
              background: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={saving}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              border: "none",
              background: "#185fa5",
              color: "#fff",
              cursor: saving
                ? "not-allowed"
                : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving
              ? "Saving..."
              : editing
              ? "Save Changes"
              : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
}

