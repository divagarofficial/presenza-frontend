import { useState } from "react";
import Popup from "../../components/Popup";

function TimetableManagement() {
  /* ================= SUBJECT MANAGEMENT ================= */
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState({
    code: "",
    name: "",
    semester: "",
    section: "",
  });

  /* ================= SLOT MANAGEMENT ================= */
  const [slots, setSlots] = useState([]);
  const [slot, setSlot] = useState({
    name: "",
    start: "",
    end: "",
  });

  /* ================= TIMETABLE ================= */
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [timetable, setTimetable] = useState([]);

  /* ================= POPUP ================= */
  const [popup, setPopup] = useState({
    type: "",
    message: "",
  });

  /* ================= HANDLERS ================= */

  const addSubject = () => {
    if (
      !subject.code ||
      !subject.name ||
      !subject.semester ||
      !subject.section
    ) {
      setPopup({
        type: "error",
        message: "All subject fields are required",
      });
      return;
    }

    setSubjects([...subjects, subject]);
    setSubject({ code: "", name: "", semester: "", section: "" });

    setPopup({
      type: "success",
      message: "Subject added successfully",
    });
  };

  const addSlot = () => {
    if (!slot.name || !slot.start || !slot.end) {
      setPopup({
        type: "error",
        message: "All slot timing fields are required",
      });
      return;
    }

    setSlots([...slots, slot]);
    setSlot({ name: "", start: "", end: "" });

    setPopup({
      type: "success",
      message: "Slot timing added",
    });
  };

  const mapSubject = (day, slotName, subjectCode) => {
    if (!subjectCode) return;

    const exists = timetable.find(
      (t) => t.day === day && t.slot === slotName
    );

    if (exists) {
      setTimetable(
        timetable.map((t) =>
          t.day === day && t.slot === slotName
            ? { ...t, subject: subjectCode }
            : t
        )
      );
    } else {
      setTimetable([
        ...timetable,
        { day, slot: slotName, subject: subjectCode },
      ]);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="admin-page">
      <h2>Timetable Management</h2>
      <p className="muted">
        Configure subjects, slot timings and weekly timetable
      </p>

      {/* ================= SUBJECTS ================= */}
      <div className="admin-card">
        <h3>Add Subject</h3>

        <div className="form-grid">
          <input
            placeholder="Subject Code"
            value={subject.code}
            onChange={(e) =>
              setSubject({ ...subject, code: e.target.value })
            }
          />

          <input
            placeholder="Subject Name"
            value={subject.name}
            onChange={(e) =>
              setSubject({ ...subject, name: e.target.value })
            }
          />

          <input
            placeholder="Semester"
            value={subject.semester}
            onChange={(e) =>
              setSubject({ ...subject, semester: e.target.value })
            }
          />

          <input
            placeholder="Section"
            value={subject.section}
            onChange={(e) =>
              setSubject({ ...subject, section: e.target.value })
            }
          />
        </div>

        <button className="primary-btn" onClick={addSubject}>
          Add Subject
        </button>
      </div>

      {/* ================= SUBJECT LIST ================= */}
      <div className="admin-card">
        <h3>Subjects</h3>

        {subjects.length === 0 && (
          <p className="muted">No subjects added yet</p>
        )}

        {subjects.map((s, i) => (
          <div key={i} className="list-row">
            <div>
              <strong>{s.code}</strong> – {s.name}
            </div>
            <span className="tag">
              Sem {s.semester} | Sec {s.section}
            </span>
          </div>
        ))}
      </div>

      {/* ================= SLOT TIMINGS ================= */}
      <div className="admin-card">
        <h3>Define Slot Timings</h3>

        <div className="form-grid">
          <input
            placeholder="Slot Name (Slot 1)"
            value={slot.name}
            onChange={(e) =>
              setSlot({ ...slot, name: e.target.value })
            }
          />

          <input
            type="time"
            value={slot.start}
            onChange={(e) =>
              setSlot({ ...slot, start: e.target.value })
            }
          />

          <input
            type="time"
            value={slot.end}
            onChange={(e) =>
              setSlot({ ...slot, end: e.target.value })
            }
          />
        </div>

        <button className="primary-btn" onClick={addSlot}>
          Add Slot
        </button>
      </div>

      {/* ================= SLOT LIST ================= */}
      <div className="admin-card">
        <h3>Slot Timings</h3>

        {slots.length === 0 && (
          <p className="muted">No slots defined yet</p>
        )}

        {slots.map((s, i) => (
          <div key={i} className="list-row">
            <strong>{s.name}</strong>
            <span className="tag">
              {s.start} – {s.end}
            </span>
          </div>
        ))}
      </div>

      {/* ================= WEEKLY TIMETABLE ================= */}
      <div className="admin-card">
        <h3>Weekly Timetable</h3>

        {slots.length === 0 || subjects.length === 0 ? (
          <p className="muted">
            Add subjects and slot timings before mapping timetable
          </p>
        ) : (
          days.map((day) => (
            <div key={day} className="day-block">
              <h4>{day}</h4>

              {slots.map((s) => (
                <div key={s.name} className="map-row">
                  <span>{s.name}</span>

                  <select
                    onChange={(e) =>
                      mapSubject(day, s.name, e.target.value)
                    }
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub.code} value={sub.code}>
                        {sub.code}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* ================= POPUP ================= */}
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
