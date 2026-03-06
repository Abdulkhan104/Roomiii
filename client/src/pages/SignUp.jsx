import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signN from "../assets/auth/signup.png";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormdData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormdData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <section className="flex items-center justify-center sm:space-x-1 lg:space-x-40 max-w-6xl mx-auto">
      {/* left img */}
      <div className=" hidden lg:flex shrink-0">
        <img src={signN} alt="img" className="w-[500px] h-[420px] mt-9" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-[#F0FDF4] flex flex-col  border-[3px] mt-9 sm:w-[400px] lg:w-[500px] rounded-[0.6rem] shadow-lg">
          <div className=" font-bold text-white text-[25px]  bg-[#ed5012] rounded-[0.4rem]  h-[48px] ">
            <p className="mx-4 p-1 font-bold text-[25px]">Sign Up</p>
          </div>

          <div className="flex flex-col mt-4 mx-2 space-y-2 ">
            <div className="flex flex-col">
              <span className="text-[16px] cursor-default font-semibold">
                Full Name of user
              </span>
              <input
                className=" mt-2 px-4 py-2 text-xl text-gray-800 bg-white border-[1px] border-gray-400 rounded transition ease-out"
                type="text"
                id="username"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col ">
              <span className="text-[16px] cursor-default font-semibold">
                Email or Mobile phone Number
              </span>
              <input
                className=" mt-2 px-4 py-2 text-xl text-gray-800 bg-white border-[1px] border-gray-400 rounded transition ease-out"
                type="email"
                id="email"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col ">
              <span className="text-[16px] cursor-default font-semibold">
                Password
              </span>
              <input
                type="password"
                className=" mt-2 px-4 py-2 text-xl text-gray-800 bg-white border-[1px] border-gray-400 rounded transition ease-out"
                id="password"
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-between  pt-5 lg:text-[15px]  text-[13px] ">
              <p>
                Have a Account?
                <Link
                  to="/sign-in"
                  className="text-red-600 font-medium hover:text-red-700 transition duration-200 ease-in-out"
                >
                  sign In
                </Link>
              </p>

              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-500 font-medium hover:text-blue-600"
                >
                  Forgot password?
                </Link>
              </p>
            </div>

            <button
              disabled={loading}
              className="text-white font-medium text-sm bg-blue-600 p-3 mt-4 rounded-lg shadow-sm hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 uppercase
          "
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
            <OAuth />

            {error && <p className="text-red-500 mt-5">{error}</p>}
          </div>
        </div>
      </form>
    </section>
  );
}
