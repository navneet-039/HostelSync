import { useNavigate } from "react-router-dom";

export default function Eirst() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-500 font-inter">

      {/* ---------- TOP HEADER STRIP ---------- */}
      <div className="w-full bg-white/90 backdrop-blur shadow-sm px-10 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-400">
          HostelSync
        </h1>

        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-lg bg-blue-400 text-white font-medium hover:bg-blue-500 transition"
        >
          Login
        </button>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="flex items-center justify-center px-6 py-24">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-xl w-full text-center">
          <h2 className="text-4xl font-extrabold text-richblack-800 mb-4">
            Smart Hostel Complaint System
          </h2>

          <p className="text-richblack-500 text-lg mb-8">
            Register, track, and resolve hostel complaints with ease.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 rounded-xl bg-blue-400 text-white font-semibold text-lg hover:bg-blue-500 transition"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 rounded-xl border-2 border-blue-400 text-blue-400 font-semibold text-lg hover:bg-blue-400 hover:text-white transition"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}