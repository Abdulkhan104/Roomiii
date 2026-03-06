import React, { useState } from "react";
import log from "../assets/auth/forgott.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Qauth from "../components/OAuth";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  function onChange(e) {
    setEmail(e.target.value);
  }

  const navigate = useNavigate();
  function onChange(e) {
    setEmail(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      navigate("/sign-in");
    } catch (error) {
    }
  }

  return (
    <section>
      <div className="flex items-center justify-center space-x-1 lg:space-x-40 max-w-6xl mx-auto">
        <div className=" hidden lg:flex shrink-0">
          <img src={log} alt="img" className="w-[500px] h-[400px] mt-9" />
        </div>

        <form onSubmit={onSubmit}>
          <div className="bg-[#F0FDF4] flex flex-col  border-[3px] mt-9 sm:w-[400px] lg:w-[500px] rounded-[0.6rem] shadow-lg">
            <div className=" font-bold text-white text-[25px]  bg-[#ed5012] rounded-[0.4rem]  h-[48px] ">
              <p className="mx-4 p-1 font-bold text-[25px]">Forgot Password</p>
            </div>
            
            <div className="flex flex-col m-2 ">
              <span className="text-[16px] cursor-default font-semibold">
                Registed Email Address
              </span>
              <input
                className=" mt-2 px-4 py-2 text-xl text-gray-800 bg-white border-[1px] border-gray-400 rounded transition ease-out"
                type="email"
                id="email"
                value={email}
                onChange={onChange}
              />
            </div>

            <div className="flex justify-between mx-2 mt-5 lg:text-[15px]  text-[13px] ">
              <p>
                Don't Have a Account?
                <Link
                  to="/sign-up"
                  className="text-red-600 font-medium hover:text-red-700 transition duration-200 ease-in-out"
                >
                  Register
                </Link>
              </p>

              <p>
                <Link
                  to="/sign-in"
                  className="text-blue-500 font-medium hover:text-blue-600"
                >
                  Log In instead
                </Link>
              </p>
            </div>
            <div className="flex justify-center flex-col m-2 gap-3 flex-wrap">
              <button
                className="w-full text-white font-medium text-sm bg-blue-600 p-3 rounded-lg shadow-sm hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800
        "
                type="submit"
              >
                Send reset password
              </button>
              <Qauth />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

// Hooks
