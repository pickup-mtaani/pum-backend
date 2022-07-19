import React, { useState } from "react";

export const ModalHeader = (props) => {
    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
        <h3 className="text-3xl font=semibold">{props.modalTitle}</h3>
        <button
            className="bg-transparent border-0 text-black float-right"
            onClick={props.toggle}
        >
            <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                x
            </span>
        </button>
    </div>
}
export const ModalBody = (props) => {
    <div className="relative p-6 flex-auto">
        {props.children}
    </div>
}

export const ModalFooter = (props) => {
    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
        <button
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
            type="button"
            onClick={props.toggle}
        >
            Close
        </button>
        <button
            className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
            type="button"
            onClick={props.toggle}
        >
            Submit
        </button>
    </div>
}

const Modal = (props) => {
    const { toggle, show } = props
    return (
        <>

            {show ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {props.modalHeader}
                                {props.modalBody}
                                {props.modalFooter}
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
};

export default Modal;