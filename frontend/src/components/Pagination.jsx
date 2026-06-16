export function Pagination({ meta, onChange }) {
  if (!meta || meta.totalPages <= 1) return null;
  const { currentPage, totalPages, totalRecords, limit } = meta;
  const from = (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, totalRecords);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", flexWrap: "wrap", gap: 10 }}>
      <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
        Showing {from}–{to} of {totalRecords} students
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        <button
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ padding: "6px 12px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "none", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.4 : 1, fontSize: 13, color: "var(--color-text-primary)" }}
        >
          ←
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={i} style={{ padding: "6px 4px", fontSize: 13, color: "var(--color-text-secondary)" }}>…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              style={{ padding: "6px 11px", borderRadius: 6, border: p === currentPage ? "1.5px solid #185fa5" : "0.5px solid var(--color-border-secondary)", background: p === currentPage ? "#e6f1fb" : "none", color: p === currentPage ? "#185fa5" : "var(--color-text-primary)", cursor: "pointer", fontWeight: p === currentPage ? 500 : 400, fontSize: 13 }}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ padding: "6px 12px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "none", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.4 : 1, fontSize: 13, color: "var(--color-text-primary)" }}
        >
          →
        </button>
      </div>
    </div>
  );
}
