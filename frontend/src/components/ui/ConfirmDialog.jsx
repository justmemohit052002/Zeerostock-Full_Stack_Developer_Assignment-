export function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", width: "100%", maxWidth: 360, padding: 24 }}>
        <p style={{ margin: "0 0 20px", fontSize: 15 }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "9px 18px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "none", cursor: "pointer", fontSize: 14 }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: "#e24b4a", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>Delete</button>
        </div>
      </div>
    </div>
  );
}
