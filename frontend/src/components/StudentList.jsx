import { Avatar } from "./ui/Avatar.jsx";
import { Badge } from "./ui/Badge.jsx";

export function StudentList({ students, onDetail, onMarks, onEdit, onDelete }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {students.map((s) => (
        <div
          key={s.id}
          style={{ background: "var(--color-background-primary)", borderRadius: 10, border: "0.5px solid var(--color-border-tertiary)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "border-color 0.15s" }}
          onClick={() => onDetail(s)}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-border-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border-tertiary)")}
        >
          <Avatar name={s.full_name} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 500, fontSize: 15 }}>{s.full_name}</span>
              <Badge label={`Class ${s.class}`} color="blue" />
            </div>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.email}</p>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onMarks(s)}
              title="Add marks"
              style={{ padding: "6px 11px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "none", cursor: "pointer", fontSize: 13, color: "var(--color-text-secondary)" }}
            >
              📊
            </button>
            <button
              onClick={() => onEdit(s)}
              title="Edit"
              style={{ padding: "6px 11px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "none", cursor: "pointer", fontSize: 13, color: "var(--color-text-secondary)" }}
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(s)}
              title="Delete"
              style={{ padding: "6px 11px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "none", cursor: "pointer", fontSize: 13, color: "#e24b4a" }}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
