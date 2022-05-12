import React, { useState } from "react";
import { getTodo, postTodo } from "../redux/actions/package.actions";
const Modal = (props) => {
  const { showModal, show, item, inputChange, Submit, loading } = props;


  return (
    <>
      {/* <button
        className="bg-blue-200 text-black active:bg-blue-500 
      font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 float-right"
        type="button"
        onClick={showModal}
      >
        New task
       
      </button> */}
      {show ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-3xl font-semibold">REJECT {item.receipt_no}</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => show(false)}
                  >
                    {/* <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                      x
                    </span> */}
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <form className="  rounded px-8 pt-6 pb-8 w-full">
                    <label className="block text-black text-sm font-bold mb-1">
                      {/* Reason To reject package {item.receipt_no} */}
                    </label>
                    <textarea onChange={inputChange} name="reject_reason"  placeholder={` Type your reason to reject ${item.receipt_no}`} className="w-full"/>
                    {/* <input
                      name="todo"
                      // type="textarea"
                      onChange={setTodo}
                      className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
                    /> */}
                  </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => showModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={Submit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
