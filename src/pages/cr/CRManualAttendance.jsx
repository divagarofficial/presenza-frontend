import { useEffect, useState } from "react";
import api from "../../api/api";

export default function CRManualAttendance() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch student list
  useEffect(() => {
    api
      .get("/cr/attendance/daily/manual/students")
      .then((res) => {
        setStudents(res.data.students);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load students");
        setLoading(false);
      });
  }, []);

  // Handle selection
  const updateStatus = (roll, status) => {
    setRecords((prev) => {
      const copy = { ...prev };
      if (!status) delete copy[roll];
      else copy[roll] = status;
      return copy;
    });
  };

  // Submit attendance
  const handleSubmit = async () => {
    if (!confirm("Submit today's attendance? Unticked students will be ABSENT.")) {
      return;
    }

    setSubmitting(true);

    const payload = {
      records: Object.entries(records).map(([roll, status]) => ({
        roll_number: roll,
        status,
      })),
    };

    try {
      await api.post("/cr/attendance/daily/manual/bulk", payload);
      alert("Attendance submitted successfully");
    } catch (err) {
      alert("Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading students…</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-indigo-600">
          Manual Attendance
        </h1>
        <p className="text-sm text-slate-500">
          Date: {new Date().toLocaleDateString("en-GB")}
        </p>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Roll No</th>
              <th className="p-3">Name</th>
              <th className="p-3 text-center">Present</th>
              <th className="p-3 text-center">OD</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr
                key={s.roll_number}
                className="border-t hover:bg-slate-50"
              >
                <td className="p-3 font-medium">{s.roll_number}</td>
                <td className="p-3">{s.name}</td>

                {/* PRESENT */}
                <td className="p-3 text-center">
                  <input
                    type="radio"
                    name={s.roll_number}
                    checked={records[s.roll_number] === "PRESENT"}
                    onChange={() =>
                      updateStatus(s.roll_number, "PRESENT")
                    }
                  />
                </td>

                {/* OD */}
                <td className="p-3 text-center">
                  <input
                    type="radio"
                    name={s.roll_number}
                    checked={records[s.roll_number] === "OD"}
                    onChange={() => updateStatus(s.roll_number, "OD")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit */}
      <div className="mt-6 flex justify-end">
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit Attendance"}
        </button>
      </div>
    </div>
  );
}

