export function Badge({ label, color = "blue" }) {
  const colors = {
    blue: { bg: "#e6f1fb", text: "#185fa5" },
    green: { bg: "#eaf3de", text: "#3b6d11" },
    amber: { bg: "#faeeda", text: "#854f0b" },
    red: { bg: "#fcebeb", text: "#a32d2d" },
    purple: { bg: "#eeedfe", text: "#534ab7" },
    teal: { bg: "#e1f5ee", text: "#0f6e56" },
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20 }}>
      {label}
    </span>
  );
}
