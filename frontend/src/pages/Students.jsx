import { useState, useEffect, useCallback } from "react";
import { StudentList } from "../components/StudentList";
import { StudentForm } from "../components/StudentForm";
import { StudentDetails } from "../components/StudentDetails";
import { Pagination } from "../components/Pagination";
import { Toasts, useToast } from "../components/ui/Toast";
import { Spinner } from "../components/ui/Spinner";
import { EmptyState } from "../components/ui/EmptyState";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

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

export default function Students() {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null); // null | "add" | "edit" | "detail"
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);

  // Accepts explicit searchVal/pageVal to avoid stale closure on search/page state
  const fetchStudents = useCallback(async (searchVal = search, pageVal = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pageVal, limit });
      if (searchVal) params.set("search", searchVal);
      const data = await api(`?${params}`);
      const list = data.data || [];
      const pagination = data.pagination || null;
      setStudents(Array.isArray(list) ? list : []);
      setMeta(pagination);
    } catch (err) {
      toast.error("Failed to load students: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Pass fresh values directly to avoid stale state in the fetch call
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
    fetchStudents(searchInput, 1);
  };

  const openAdd = () => {
    setSelected(null);
    setModal("add");
  };

  const openEdit = (s) => {
    setSelected(s);
    setModal("edit");
  };

  const openDetail = (s) => {
    setSelected(s);
    setModal("detail");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const afterSave = () => {
    closeModal();
    fetchStudents();
  };

  const handleDelete = (s) => {
    setConfirm({
      message: `Delete ${s.full_name}? This cannot be undone.`,
      onConfirm: async () => {
        setConfirm(null);
        try {
          await api(`/${s.id}`, { method: "DELETE" });
          toast.success(`${s.full_name} deleted`);
          fetchStudents();
        } catch (err) {
          toast.error(err.message);
        }
      },
      onCancel: () => setConfirm(null),
    });
  };

  const statsTotal = meta?.totalRecords ?? students.length;

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        * { box-sizing: border-box; }
        button:hover { opacity: 0.88; }
      `}</style>

      <Toasts toasts={toast.toasts} />
      {confirm && <ConfirmDialog {...confirm} />}
      {(modal === "add" || modal === "edit") && (
        <StudentForm student={modal === "edit" ? selected : null} onClose={closeModal} onSave={afterSave} toast={toast} />
      )}
      {modal === "detail" && selected && (
        <StudentDetails
          studentId={selected.id}
          onClose={closeModal}
          onEdit={(s) => {
            closeModal();
            openEdit(s);
          }}
          onAddMarks={(s) => {
            closeModal();
            openDetail(s);
          }}
          toast={toast}
        />
      )}

      {/* Layout */}
      <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary, #f8f8f6)" }}>
        {/* Header */}
        <header style={{ background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🎓</span>
            <span style={{ fontSize: 17, fontWeight: 500, color: "var(--color-text-primary)" }}>Zeerostock SMS</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Student Management System</div>
        </header>

        <main style={{ maxWidth: 920, margin: "0 auto", padding: "28px 16px" }}>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Total students", value: statsTotal, color: "#185fa5", bg: "#e6f1fb" },
              { label: "This page", value: students.length, color: "#0f6e56", bg: "#e1f5ee" },
              { label: "Total pages", value: meta?.totalPages ?? 1, color: "#534ab7", bg: "#eeedfe" },
            ].map((s) => (
              <div key={s.label} style={{ background: "var(--color-background-secondary)", borderRadius: 8, padding: "14px 16px" }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: "var(--color-text-secondary)" }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 500, color: s.color }}>{s.value ?? "—"}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <form onSubmit={handleSearch} style={{ display: "flex", flex: 1, minWidth: 200, gap: 6 }}>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name or email…"
                style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", fontSize: 14, background: "var(--color-background-primary)", color: "var(--color-text-primary)", outline: "none" }}
              />
              <button type="submit" style={{ padding: "9px 16px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", cursor: "pointer", fontSize: 14, color: "var(--color-text-primary)" }}>
                Search
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSearchInput("");
                    setPage(1);
                    fetchStudents("", 1);
                  }}
                  style={{ padding: "9px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "none", cursor: "pointer", fontSize: 13, color: "var(--color-text-secondary)" }}
                >
                  Clear
                </button>
              )}
            </form>
            <button
              onClick={openAdd}
              style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: "#185fa5", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap" }}
            >
              + Add student
            </button>
          </div>

          {/* Student list */}
          {loading ? (
            <Spinner />
          ) : !students.length ? (
            <EmptyState message={search ? `No students found for "${search}"` : "No students yet"} onAdd={!search ? openAdd : undefined} />
          ) : (
            <StudentList students={students} onDetail={openDetail} onMarks={openDetail} onEdit={openEdit} onDelete={handleDelete} />
          )}

          {/* Pagination */}
          {meta && <Pagination meta={{ ...meta, limit }} onChange={(p) => setPage(p)} />}
        </main>
      </div>
    </>
  );
}