import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import Popup from "../../components/Popup";

function TimetableManagement() {
  const days = useMemo(
    () => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    []
  );

  /* ================= SUBJECT MANAGEMENT ================= */
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState({
    code: "",
    name: "",
  });

  /* ================= SLOT TIMINGS ================= */
  const [timeSlots, setTimeSlots] = useState([]);
  const [slot, setSlot] = useState({
    slot_name: "Slot 1",
    start_time: "",
    end_time: "",
  });

  /* ================= TIMETABLE ================= */
  // key = `${day}__${slot_id}` -> subject_id | null
  const [mapping, setMapping] = useState({});

  const [popup, setPopup] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const fetchAll = async () => {
    setLoadError("");
    const [subRes, slotsRes, timetableRes] = await Promise.all([
      api.get("/admin/subjects"),
      api.get("/admin/time-slots"),
      api.get("/admin/weekly-timetable"),
    ]);

    setSubjects(subRes.data.subjects || []);
    setTimeSlots(slotsRes.data.time_slots || []);

    const next = {};
    const cells = timetableRes.data?.timetable || [];
    for (const c of cells) {
      next[`${c.day}__${c.slot_id}`] = c.subject_id ?? null;
    }
    setMapping(next);
  };

  useEffect(() => {
    fetchAll().catch((e) => {
      console.error(e);
      setLoadError(
        e?.response?.data?.detail ||
          e?.message ||
          "Failed to load timetable data"
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addSubject = async () => {
    try {
      if (!subject.code.trim() || !subject.name.trim()) {
        setPopup({ type: "error", message: "Subject code and name are required" });
        return;
      }

      setLoading(true);
      await api.post("/admin/subjects", subject);
      setSubject({ code: "", name: "" });
      await fetchAll();
      setPopup({ type: "success", message: "Subject added successfully" });
    } catch (err) {
      console.error(err);
      setPopup({
        type: "error",
        message: err?.response?.data?.detail || "Failed to add subject",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = async () => {
    try {
      if (!slot.slot_name.trim() || !slot.start_time || !slot.end_time) {
        setPopup({ type: "error", message: "Slot name, start time and end time are required" });
        return;
      }

      setLoading(true);
      // backend expects TimeSlotCreateSchema { slot_name, start_time, end_time }
      await api.post("/admin/time-slots", slot);
      await fetchAll();
      setPopup({ type: "success", message: "Slot created successfully" });
      setSlot({ slot_name: "Slot 1", start_time: "", end_time: "" });
    } catch (err) {
      console.error(err);
      setPopup({
        type: "error",
        message: err?.response?.data?.detail || "Failed to create slot",
      });
    } finally {
      setLoading(false);
    }
  };

  const setCellSubject = (day, slotId, subjectId) => {
    setMapping((prev) => ({
      ...prev,
      [`${day}__${slotId}`]: subjectId ?? null,
    }));
  };

  const buildUpsertPayload = () => {
    const cells = [];
    for (const day of days) {
      for (const ts of timeSlots) {
        const key = `${day}__${ts.id}`;
        const subjectId = mapping[key] ?? null;
        cells.push({ day, slot_id: ts.id, subject_id: subjectId });
      }
    }
    return { cells };
  };

  const saveWeeklyTimetable = async () => {
    try {
      setLoading(true);
      await api.post("/admin/weekly-timetable", buildUpsertPayload());
      setPopup({ type: "success", message: "Weekly timetable saved" });
      await fetchAll();
    } catch (err) {
      console.error(err);
      setPopup({
        type: "error",
        message: err?.response?.data?.detail || "Failed to save timetable",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearWeeklyTimetable = async () => {
    try {
      setLoading(true);
      // Set every cell to null
      const cells = [];
      for (const day of days) {
        for (const ts of timeSlots) {
          cells.push({ day, slot_id: ts.id, subject_id: null });
        }
      }
      await api.post("/admin/weekly-timetable", { cells });
      setPopup({ type: "success", message: "Weekly timetable cleared" });
      await fetchAll();
    } catch (err) {
      console.error(err);
      setPopup({
        type: "error",
        message: err?.response?.data?.detail || "Failed to clear timetable",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h2>Timetable Management</h2>
      <p className="muted">Admin: Subjects, slot timings, and weekly timetable mapping</p>

      {loadError ? <p className="muted" style={{ color: "#ef4444" }}>{loadError}</p> : null}

      {/* ================= SUBJECTS ================= */}
      <div className="admin-card">
        <h3>Add Subject</h3>
        <div className="form-grid">
          <input
            placeholder="Subject Code"
            value={subject.code}
            onChange={(e) => setSubject({ ...subject, code: e.target.value })}
          />
          <input
            placeholder="Subject Name"
            value={subject.name}
            onChange={(e) => setSubject({ ...subject, name: e.target.value })}
          />
        </div>
        <button className="primary-btn" onClick={addSubject} disabled={loading}>
          Add Subject
        </button>
      </div>

      <div className="admin-card">
        <h3>Subjects</h3>
        {subjects.length === 0 ? (
          <p className="muted">No subjects found</p>
        ) : (
          subjects.map((s) => (
            <div key={s.id} className="list-row">
              <div>
                <strong>{s.code}</strong> – {s.name}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= SLOT TIMINGS ================= */}
      <div className="admin-card">
        <h3>Define Slot Timings</h3>
        <div className="form-grid">
          <input
            placeholder="Slot name (e.g. Slot 1)"
            value={slot.slot_name}
            onChange={(e) => setSlot({ ...slot, slot_name: e.target.value })}
          />
          <input
            type="time"
            value={slot.start_time}
            onChange={(e) => setSlot({ ...slot, start_time: e.target.value })}
          />
          <input
            type="time"
            value={slot.end_time}
            onChange={(e) => setSlot({ ...slot, end_time: e.target.value })}
          />
        </div>
        <button className="primary-btn" onClick={addTimeSlot} disabled={loading}>
          Add Slot
        </button>
      </div>

      <div className="admin-card">
        <h3>Slot Timings</h3>
        {timeSlots.length === 0 ? (
          <p className="muted">No slots defined yet</p>
        ) : (
          timeSlots.map((s) => (
            <div key={s.id} className="list-row">
              <div>
                <strong>{s.slot_name}</strong>
              </div>
              <span className="tag">
                {s.start_time} – {s.end_time}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ================= WEEKLY TIMETABLE ================= */}
      <div className="admin-card">
        <h3>Weekly Timetable</h3>

        {timeSlots.length === 0 || subjects.length === 0 ? (
          <p className="muted">Add subjects and slot timings before mapping timetable</p>
        ) : (
          <>
            {days.map((day) => (
              <div key={day} className="day-block">
                <h4>{day}</h4>
                {timeSlots.map((ts) => {
                  const key = `${day}__${ts.id}`;
                  const selectedSubjectId = mapping[key] ?? null;

                  return (
                    <div key={ts.id} className="map-row">
                      <span>{ts.slot_name}</span>
                      <select
                        value={selectedSubjectId ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setCellSubject(
                            day,
                            ts.id,
                            v === "" ? null : Number(v)
                          );
                        }}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            ))}

            <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
              <button className="primary-btn" onClick={saveWeeklyTimetable} disabled={loading}>
                Save Timetable
              </button>
              <button className="secondary-btn" onClick={clearWeeklyTimetable} disabled={loading}>
                Clear
              </button>
            </div>
          </>
        )}
      </div>

      <Popup
        type={popup.type}
        message={popup.message}
        actionText="OK"
        onAction={() => setPopup({ type: "", message: "" })}
      />
    </div>
  );
}

export default TimetableManagement;

