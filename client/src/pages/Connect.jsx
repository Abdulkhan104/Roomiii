import React, { useState, useRef } from "react";
import { FaInstagram } from "react-icons/fa";
import { FaSquarePhone } from "react-icons/fa6";
import { IoMdMail, IoLogoYoutube } from "react-icons/io";

export default function Connect() {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    resume: null,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Simulate a form submit handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    setSuccess("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!form.name || !form.email || !form.resume) {
      setError("All fields are required.");
      return;
    }
    // Simulate API call delay
    setTimeout(() => {
      setSuccess(
        "Thank you for applying! Our team will review your application and contact you soon."
      );
      setForm({
        name: "",
        email: "",
        resume: null,
      });
      fileInputRef.current.value = ""; // Clear file input
    }, 1200);
  };

  return (
    <section
      id="connect"
      className="py-20 bg-gradient-to-tr from-white via-gray-50 to-orange-50"
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 justify-center items-start px-4">
        {/* Job Application Form */}
        <div className="w-full md:w-1/2 bg-white p-10 rounded-2xl shadow-xl border">
          <h2 className="text-4xl font-extrabold mb-8 text-slate-800 tracking-tight">
            Join Our Team
          </h2>
          <p className="mb-6 text-gray-500 text-base leading-relaxed">
            We're always on the lookout for passionate individuals. If you're interested in being part of the RooMoo journey, submit your details and resume below!
          </p>
          {success && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-600 text-green-800 px-4 py-2 rounded">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-600 text-red-800 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            autoComplete="off"
          >
            <div className="flex flex-wrap -mx-2">
              <div className="w-full sm:w-1/2 px-2 mb-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 p-2 w-full border rounded-lg text-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                  placeholder="Enter your name"
                />
              </div>
              <div className="w-full sm:w-1/2 px-2 mb-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2 p-2 w-full border rounded-lg text-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                  placeholder="your@email.com"
                  autoComplete="off"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="resume"
                className="block text-sm font-semibold text-gray-700"
              >
                Resume{" "}
                <span className="text-xs text-gray-400">
                  (PDF or Word - max 5MB)
                </span>
              </label>
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf, .doc, .docx"
                ref={fileInputRef}
                onChange={handleChange}
                className="mt-2 p-2 w-full border rounded-lg bg-gray-50 file:mr-3 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-sm file:bg-orange-100 file:text-orange-700"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white shadow-lg px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Submit Application
            </button>
          </form>
        </div>
        {/* Contact Details */}
        <div className="w-full md:w-1/2 bg-white p-10 rounded-2xl shadow-xl border flex flex-col gap-7">
          <h2 className="text-4xl font-extrabold mb-5 text-slate-800 tracking-tight">
            Contact Us
          </h2>
          <div className="flex items-center gap-3 text-lg">
            <IoLogoYoutube className="text-red-600 text-2xl" />
            <a
              href="https://youtube.com/@roomoo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-red-700 hover:font-bold transition"
            >
              Youtube / RooMoo
            </a>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <FaInstagram className="text-pink-500 text-2xl" />
            <a
              href="https://instagram.com/roomoo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-pink-700 hover:font-bold transition"
            >
              Instagram / @roomoo
            </a>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <FaSquarePhone className="text-green-600 text-2xl" />
            <span className="text-gray-700 font-medium">
              Phone:{" "}
              <a
                href="tel:800045641298"
                className="hover:text-black hover:font-bold transition"
              >
                8000-4564-1298
              </a>
            </span>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <IoMdMail className="text-blue-600 text-2xl" />
            <span className="text-gray-700 font-medium">
              Email:{" "}
              <a
                href="mailto:officialroomoo@gmail.com"
                className="hover:text-blue-800 hover:font-bold transition"
              >
                officialroomoo@gmail.com
              </a>
            </span>
          </div>
          <div className="mt-7">
            <div className="text-base text-slate-500">
              For business inquiries or partnership opportunities,
              <span className="ml-1">
                reach out and we’ll get back in 24 hours.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
