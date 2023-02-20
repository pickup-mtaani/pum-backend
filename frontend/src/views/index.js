import React, { useEffect, useState } from "react";
import AddTodoModal from "../components/reject.componenet";
import { connect } from "react-redux";
import { getParcels, reject, recieve, postPackage, collect } from "../redux/actions/package.actions";
import { getlocations, addthrift } from "../redux/actions/location.actions";
import { AuthUser } from "../redux/actions/auth.actions";
import { Layout } from "./layout";
import RecieveModal from "../components/RecieveModal";
import AddModal from "../components/AddPackageModal";

import { useNavigate } from "react-router-dom";
import AddThrift from "../components/AddThriftModal";

export function Todo(props) {

    let navigate = useNavigate();
    const { packages, locations } = props
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const [showAdd, setShowAd] = useState(false);
    const [item, setItem] = useState({});
    const [packageObj, setPackage] = useState({ recipient_name: '', recipient_phone: '', current_custodian: '', package_value: 0, pack_color: '' });
    const [reciver, setReciever] = useState({ reciver_id_no: '', reciver_phone_no: '', reciver_name: '' });
    const [reject_reason, setReason] = useState('');
    const [thrift, setThrift] = useState({ name: '', location: '' })
    const [showThrift, setShowThrift] = useState(false)
    const inputChange = (e) => {
        setReason(e.target.value);
    };

    const changeInput = (e) => {
        const { value, name } = e.target;
        setReciever((prevState) => ({
            ...prevState,
            [name]: value,
        }));

    }
    const changeonInput = (e) => {
        const { value, name } = e.target;
        setThrift((prevState) => ({
            ...prevState,
            [name]: value,
        }));

    }
    const SubmitThrift = async () => {
        try {

            await props.addthrift(thrift)
            // await props.getlocations()
            // await props.AuthUser(user.id)
            // setShowThrift(false)
        } catch (error) {
            // setShowThrift(false)
            //    //alert(error)
            //    
        }
    }
    const onchangeInput = (e) => {
        const { value, name } = e.target;
        setPackage((prevState) => ({
            ...prevState,
            [name]: value,
        }));

    }
    const SubmitPackage = async () => {
        try {

            await props.postPackage(packageObj)
            await props.getParcels();
            setShowAd(false);
        } catch (error) {

            throw error;
        }
    }
    const submitRecieve = async (id) => {
        try {

            await props.recieve(id)
            await props.getParcels();
            setShow(false);
        } catch (error) {

            throw error;
        }
    }
    const submitCollect = async () => {
        try {
            const id = item._id
            await props.collect(id, reciver)
            await props.getParcels();
            setShow(false);
        } catch (error) {

            throw error;
        }
    }
    const openModal = (data) => {
        if (!data.rejected) { setShowModal(true); }
        setItem(data)
    }

    const openReciveModal = (data) => {
        setShow(true)
        setItem(data)
    }
    useEffect(() => {
        const fetchData = async () => {
            const user = await JSON.parse(localStorage.getItem("userInfo"));

            props.getParcels();
            props.getlocations()
            if (!user) {
                return navigate("/");
            }
        }
        fetchData()
            .catch(console.error);
    }, []);

    const submit = async () => {
        try {
            const id = item._id
            // data = {reject_reason}
            await props.reject(id, { reject_reason })
            await props.getParcels();
            setShowModal(false);
        } catch (error) {

            throw error;
        }
    }

    const Badge = () => {
        <div className='p-1 w-3 h-2 bg-red-100'></div>
    }
    return (
        <Layout>
            <div className="flex w-full">

                <div className="w-full pb-2 bg-slate-200">
                    <h3 className="text-3xl uppercase text-center pt-5 pb-3">
                        {/* My Active Tasks */}
                    </h3>

                    <button onClick={() => setShowThrift(true)} className=" float-right bg-green-400 shadow-2 px-1 py-1 rounded-md m-2">{user && user !== undefined && user.role === "client" ? "Create A threift" : "Add Thrift"}</button>

                    <button type="button" onClick={() => setShowAd(true)} className=" float-right bg-green-400 shadow-2 px-1 py-1 rounded-md m-2">ADD</button>
                    <table className=" w-full bordered table border-1">
                        <thead>
                            <tr className="bg-slate-500">
                                <th>RECIEPT</th>
                                <th>SENDER</th>
                                <th>RECIEVER</th>
                                <th>VALUE</th>
                                <th>STATUS</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>

                            {packages !== undefined && packages.map((pack) => (
                                <tr key={pack.receipt_no} className=" border-2 border-white">
                                    <td className="border-2 border-white text-center">{pack.receipt_no}</td>
                                    <td className="border-2 border-white text-center">{pack.thrifter_id && pack.thrifter_id.name}</td>
                                    <td className="border-2 border-white text-center">{pack.recipient_name}</td>
                                    <td className="border-2 border-white text-center">{pack.package_value}</td>
                                    <td className="border-2 border-white text-center">
                                        <Badge />
                                        {pack.recieved ? "recieved" : pack.rejected ? "Rejected" : pack.returned ? "Returned" : "panding"}

                                    </td>


                                    <td>
                                        {pack.recieved && !pack.rejected && <button type="button" onClick={() => openReciveModal(pack)} className={pack.collected ? "bg-green-900 shadow-2 px-1 py-1 rounded-md m-2 text-white" : "bg-green-300 shadow-2 px-1 py-1 rounded-md m-2"}>{pack.collected ? "Collected" : "Collect"}</button>}
                                        {!pack.collected && !pack.recieved && <button type="button" onClick={() => submitRecieve(pack._id)} className="bg-green-400 shadow-2 px-1 py-1 rounded-md m-2">Recieve</button>}
                                        {!pack.collected && !pack.rejected && !pack.recieved && <button type="button" onClick={() => openModal(pack)} className={item.rejected ? "bg-grey-400 shadow-2 px-1 py-1 rounded-md m-2" : "bg-red-400 shadow-2 px-1 py-1 rounded-md m-2"}>Reject</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <AddTodoModal
                        showModal={setShowModal}
                        item={item}
                        show={showModal}
                        inputChange={inputChange}
                        Submit={submit}
                    />
                    <RecieveModal
                        show={show}
                        item={item}
                        changeInput={changeInput}
                        toggleModal={() => setShow(false)}
                        Submit={submitCollect}
                    />
                    <AddModal
                        show={showAdd}
                        toggleModal={() => setShow(false)}
                        changeInput={onchangeInput}
                        Submit={SubmitPackage}
                        locations={locations}
                    />

                    <AddThrift
                        show={showThrift}
                        toggleModal={() => setShowThrift(false)}
                        changeInput={changeonInput}
                        Submit={SubmitThrift}
                        locations={locations}
                    />
                </div>

            </div>
        </Layout >
    );
}

const mapStateToProps = (state) => {
    return {
        error: state.PackageDetails.error,
        loading: state.PackageDetails.loading,
        packages: state.PackageDetails.packages,
        locations: state.LocationDetail.locations,
        user: state.userDetails.user,

    };
};

export default connect(mapStateToProps, { getParcels, reject, recieve, collect, getlocations, postPackage, AuthUser, addthrift })(Todo);
