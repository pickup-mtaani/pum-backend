import React, { useState } from "react";

export default function Login(props) {
  const { toggleRegistering, registering, changeInput, submit, error } = props;

  return (
    <div class="w-full h-screen  flex justify-center items-center">
      <div class="bg-gray-400 w-full h-full relative z-0 flex justify-center items-center">
        <div class="w-3/4 h-3/4 bg-white shadow-xl ">
          <div className="w-96 bg-red-600 h-full mx-4"></div>
          <div></div>
        </div>
        <div class="absolute inset-0 flex  z-10">
          <div class="h-full w-2/5 bg-primary-600 opacity-40"></div>
        </div>
      </div>
    </div>
  );
}
export function Login1(props) {
  const { toggleRegistering, registering, changeInput, submit, error } = props;

  return (
    <div className=" h-2/4  md:w-1/4 w-1/2 bg-transparent py-10 px-2 shadow-xl">
      <h3 className="text-2xl text-white text-center py-4 uppercase">
        WElCOME
      </h3>
      <div className="bg-slate-300 h-full rounded-3xl p-10">
        {error && <div className="bg-red-100 text-center mb-5">{error}</div>}
        <div className="flex flex-col">
          <label className="  font-medium">Email:</label>
          <input
            type="email"
            name="username"
            onChange={changeInput}
            className=" bg-transparent border-b border-slate-500"
          />
        </div>
        <div className="flex flex-col py-5">
          <label className="  font-medium">Password:</label>
          <input
            type="password"
            name="password"
            onChange={changeInput}
            className=" bg-transparent border-b border-slate-500"
          />
        </div>
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={submit}
            className="bg-gradient-to-r w-20 focus:bg-transparent focus:border-0  shadow-2xl rounded-2xl px-3 py-1 from-blue-400 to-indigo-600 hover:from-indigo-500 hover:to-slate-500 ..."
          >
            Login
          </button>
        </div>
        {!registering && (
          <h1
            className="text-center text-sm text-indigo-500"
            onClick={toggleRegistering}
          >
            Sign up
          </h1>
        )}
      </div>
    </div>
  );
}
