import React from "react";
import Logo from "./../img/top_logo.png";

export default function Login(props) {
  const { changeInput, submit, error } = props;

  return (
    <div className="w-full h-screen  flex justify-center items-center">
      <div className="bg-slate-100 w-full h-full relative z-0 flex justify-center items-center ">
        <div className=" w-[94%] md:w-3/4 h-3/4 bg-white shadow-xl  relative">
          <div className="w-12 h-12 rounded-full border-2 flex md:hidden absolute right-4 top-4 justify-center items-center">
            <img src={Logo} alt="" width={200} />
          </div>

          <div className="text-center font-bold uppercase underline text-2xl absolute top-6 right-0 left-0">
            Login
          </div>
          <div className="flex h-full w-full">
            <div className="w-96 h-full hidden md:flex justify-center items-center ">
              <div className="relative z-0 w-full h-full flex justify-center items-center flex-col">
                {/* <h2 className="uppercase text-3xl mb-10 font-bold underline underline-offset-2 ">Pick Mtaani</h2> */}
                <div className="w-60 h-60 rounded-full border-2 flex justify-center items-center">
                  <img src={Logo} alt="" width={200} />
                </div>
                <div className="absolute inset-0 flex  -z-10">
                  <div className="h-full w-full bg-gradient-to-t from-primary-500 to-primary-600 "></div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center gap-3 mx-10 flex-col w-full md:w-1/2 ">
              {error && (
                <div className="bg-red-100 text-center mb-5 py-2 px-3 border w-full text-red-600">
                  {error}
                </div>
              )}
              <div className="w-full ">
                <div className="uppercase text-slate-600   py-2">
                  Phone Number
                </div>
                <input
                  name="phone_number"
                  type="text"
                  autoComplete="off"
                  onChange={changeInput}
                  className="border border-slate-200 w-full px-3 py-2"
                  placeholder="Phone Number"
                />
              </div>
              <div className="w-full ">
                <div className="uppercase text-slate-600  py-2">Password</div>
                <input
                  name="password"
                  type="password"
                  autoComplete="off"
                  onChange={changeInput}
                  className="border border-slate-200 w-full px-3 py-2"
                  placeholder="Password"
                />
              </div>
              {/* <div className=" flex w-full justify-end my-3">Forgot password</div> */}
              <div
                className="w-full bg-primary font-semibold rounded uppercase px-3 py-2 flex justify-center items-center my-10"
                onClick={() => submit()}
              >
                {props.loading ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                ) : (
                  "Login"
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="absolute inset-0 flex  z-10">
          <div className="h-full w-2/5 bg-primary-600 opacity-30">

          </div>
        </div> */}
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
