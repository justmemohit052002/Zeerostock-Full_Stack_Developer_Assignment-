export function Avatar({ name, size = 36 }) {
  const initials = name ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  const colors = ["#185fa5", "#0f6e56", "#534ab7", "#993c1d", "#993556", "#3b6d11"];
  const color = colors[name ? name.charCodeAt(0) % colors.length : 0];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color + "22", border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 500, color, flexShrink: 0 }}>
      {initials}
    </div>
  );
}
