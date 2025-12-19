import { useContext } from "react";
import { SupervisorContext } from "../context/SupervisorContext";

export default function SupervisorDashboard() {
  const { complaints, dataLoading } = useContext(SupervisorContext);

  if (dataLoading) {
    return <p className="text-center mt-10">Loading complaints...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Hostel Complaints
      </h2>

      {complaints.length === 0 && (
        <p>No pending complaints found</p>
      )}

      <div className="space-y-4">
        {complaints.map((c) => (
          <div
            key={c._id}
            className="border rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between">
              <h4 className="font-medium">
                Room {c.student.roomNumber} | Floor {c.student.floor}
              </h4>
              <span className="text-orange-600 text-sm">
                {c.status}
              </span>
            </div>

            <p className="mt-2 text-gray-700">
              {c.description}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Reg No: {c.student.registrationNumber}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
