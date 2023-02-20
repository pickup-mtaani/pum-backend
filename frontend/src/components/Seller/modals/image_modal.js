import React, { useEffect, useState } from 'react'
import Modal from '../../common/modal'

function AddAdmin() {
    return (
        <div className="w-full ">
            <div>
                <div>Name</div>
                <input type="text" className="" name="name" />
            </div>

        </div>
    )


}
function Image_modal(props) {
    const { toggle, show } = props
    const [active, setActive] = useState(0)
    useEffect(() => {
        setActive(props.active)
    }, [])
    return (

        <>

            {
                show ? (
                    <>
                        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto  bg-transparent fixed inset-0 z-50 outline-none focus:outline-none min-width:screen">
                            <div className="relative w-full rounded-sm my-6 mx-auto max-w-3xl bg-red-200  ">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                                        <h3 className="text-sm italic">{`${active + 1} of ${props.image.length}`}</h3>
                                        <button
                                            className="bg-transparent border-0 text-black float-right"
                                            onClick={props.toggle}
                                        >
                                            <span className="text-black opacity-7 h-6 w-6 text-xl  py-0 rounded-full flex justify-center items-center">
                                                x
                                            </span>
                                        </button>
                                    </div>
                                    <div className="relative p-6 flex-auto">

                                        <img src={props.image[active]} alt="" style={{ width: "100%", height: "300px", objectFit: 'cover' }} />
                                    </div>
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">

                                        {props.image.map((imag, i) => (
                                            <div className="gap-x-2 flex " onClick={() => setActive(i)} key={i} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                                                <div className=" mr-1" style={{ border: active !== i ? 'none' : '3px solid #ffc107', borderRadius: '10px' }}>
                                                    <img src={imag} alt="" style={{ width: "50px", height: "50px", borderRadius: '10px', objectFit: 'cover' }} />
                                                </div>
                                            </div>
                                            // <h1 style={{ color: props.active === i ? "red" : 'yellow' }}>{imag}</h1>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
                ) : null
            }</>
    );
};

export default Image_modal