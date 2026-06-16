import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };
  return { toasts, success: (m) => add(m, "success"), error: (m) => add(m, "error") };
}

export function Toasts({ toasts }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            color: t.type === "success" ? "#fff" : "#fff",
            background: t.type === "success" ? "#1d9e75" : "#e24b4a",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            minWidth: 220,
            animation: "fadeIn 0.2s ease",
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
