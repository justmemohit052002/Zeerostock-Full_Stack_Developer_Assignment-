export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "3rem" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #e6f1fb", borderTop: "3px solid #185fa5", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );
}
