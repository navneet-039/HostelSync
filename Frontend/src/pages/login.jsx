import React from "react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md px-8 py-10">
        <h2 className="text-2xl font-semibold text-slate-800 text-center mb-6">
          Login Credentials
        </h2>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email ID <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="example@domain.com"
              required
              className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-md
                       font-medium hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
