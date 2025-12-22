import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/authContext";
import Navbar from "../components/Navbar";
import { FiClipboard, FiUsers, FiCheckCircle } from "react-icons/fi";

export default function Home() {
  const { loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return <p className="text-center mt-20 text-lg">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-richblack-5 font-inter">
      <Navbar />

      {/* ---------- HERO SECTION ---------- */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-richblack-800 leading-tight">
            Simplify Hostel <br />
            <span className="text-blue-200">Complaint Management</span>
          </h1>

          <p className="mt-6 text-lg text-richblack-500 max-w-xl">
            HostelSync provides a transparent and efficient platform where
            students can register hostel-related complaints and supervisors
            can track and resolve them without paperwork or confusion.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/register-complaints")}
              className="px-6 py-3 rounded-xl bg-blue-200 text-white font-medium hover:bg-blue-300 transition"
            >
              Register Complaint
            </button>

            <button
              onClick={() => navigate("/all-complaints")}
              className="px-6 py-3 rounded-xl border border-blue-200 text-blue-200 font-medium hover:bg-blue-5 transition"
            >
              View Complaints
            </button>
          </div>
        </div>

        {/* INFO CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-richblack-700 mb-4">
            Why HostelSync?
          </h3>

          <ul className="space-y-4 text-richblack-500">
            <li className="flex items-center gap-3">
              <FiCheckCircle className="text-blue-200" />
              Easy complaint registration
            </li>
            <li className="flex items-center gap-3">
              <FiCheckCircle className="text-blue-200" />
              Real-time status updates
            </li>
            <li className="flex items-center gap-3">
              <FiCheckCircle className="text-blue-200" />
              Transparent resolution process
            </li>
            <li className="flex items-center gap-3">
              <FiCheckCircle className="text-blue-200" />
              Accessible on mobile and desktop
            </li>
          </ul>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-richblack-800 mb-10">
            How HostelSync Helps
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<FiClipboard size={32} />}
              title="For Students"
              description="Submit complaints easily and track their resolution status in real time."
            />

            <FeatureCard
              icon={<FiUsers size={32} />}
              title="For Supervisors"
              description="View all complaints, assign priority, and resolve issues efficiently."
            />

            <FeatureCard
              icon={<FiCheckCircle size={32} />}
              title="For Administration"
              description="Maintain transparency, accountability, and faster complaint handling."
            />
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-richblack-800 text-richblack-100">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-white">
              HostelSync
            </h3>
            <p className="text-sm text-richblack-200">
              A smart hostel complaint management system designed to improve
              student experience and administrative efficiency.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-richblack-200">
              <li onClick={() => navigate("/")} className="cursor-pointer hover:text-blue-200">Home</li>
              <li onClick={() => navigate("/register-complaints")} className="cursor-pointer hover:text-blue-200">Register Complaint</li>
              <li onClick={() => navigate("/all-complaints")} className="cursor-pointer hover:text-blue-200">View Complaints</li>
              <li onClick={() => navigate("/contact")} className="cursor-pointer hover:text-blue-200">Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-white">Contact</h4>
            <ul className="space-y-2 text-sm text-richblack-200">
              <li>Email: support@hostelsync.com</li>
              <li>Phone: +91 99999 88888</li>
              <li>Location: India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-richblack-700 text-center py-4 text-sm text-richblack-300">
          © {new Date().getFullYear()} HostelSync. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* ---------- FEATURE CARD ---------- */

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-richblack-5 rounded-2xl p-8 shadow hover:shadow-md transition">
      <div className="mb-4 text-blue-200 flex justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-richblack-800 mb-2">
        {title}
      </h3>
      <p className="text-richblack-500">
        {description}
      </p>
    </div>
  );
}
