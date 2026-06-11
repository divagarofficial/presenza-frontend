import { useEffect, useState } from "react";
import api from "../../api/api";
import Popup from "../../components/Popup";

function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ type: "", message: "" });
  const [markingId, setMarkingId] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // This page is used for BOTH student and CR (CR lives under /student/cr prefix)
      // But API is the same for both (student_required vs cr_required).
      const path = window.location.pathname.startsWith("/student/cr")
        ? "/cr/notifications"
        : "/students/notifications";

      const res = await api.get(path);
      setItems(res.data.notifications || []);
    } catch (e) {
      setPopup({
        type: "error",
        message: e?.response?.data?.detail || "Failed to load notifications",
      });
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      setMarkingId(id);
      const isCR = window.location.pathname.startsWith("/student/cr");
      const path = isCR
        ? `/cr/notifications/${id}/read`
        : `/students/notifications/${id}/read`;

      await api.post(path);
      await fetchNotifications();
    } catch (e) {
      setPopup({
        type: "error",
        message: e?.response?.data?.detail || "Failed to mark as read",
      });
    } finally {
      setMarkingId(null);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="admin-page">
      <h2>Notifications</h2>
      <p className="muted">Updates about approvals and attendance</p>

      {loading ? (
        <p className="muted">Loading notifications…</p>
      ) : items.length === 0 ? (
        <p className="muted">No notifications</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((n) => (
            <div key={n.id} className="admin-card" style={{ marginTop: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>
                    {n.is_read ? "✅" : "🔔"} {n.message}
                  </div>
                  <div className="muted" style={{ marginBottom: 8 }}>
                    {n.notification_type}
                    {n.created_at ? ` • ${n.created_at.slice(0, 19).replace("T", " ")}` : ""}
                  </div>
                </div>

                <button
                  className="secondary-btn small"
                  style={{ whiteSpace: "nowrap" }}
                  disabled={n.is_read || markingId === n.id}
                  onClick={() => markRead(n.id)}
                >
                  {n.is_read ? "Read" : markingId === n.id ? "Marking…" : "Mark as read"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Popup
        type={popup.type}
        message={popup.message}
        actionText="OK"
        onAction={() => setPopup({ type: "", message: "" })}
      />
    </div>
  );
}

export default Notifications;

