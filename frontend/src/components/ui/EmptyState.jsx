export function EmptyState({ message, onAdd }) {
  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-secondary)" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🎓</div>
      <p style={{ margin: "0 0 16px", fontSize: 15 }}>{message}</p>
      {onAdd && (
        <button onClick={onAdd} style={{ background: "#185fa5", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
          Add first student
        </button>
      )}
    </div>
  );
}
