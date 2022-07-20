import React, { useEffect, useState } from "react";
import Register from "./auth/register.auth";
import LoginView from "./auth/login.auth";
import { connect } from 'react-redux'

import {
  loginUser,
  registerUser,
  clearError,
} from "./redux/actions/auth.actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function Login(props) {

  const error = useSelector((state) => state.userDetails);
  const [user, setUser] = useState({

    password: "",

    phone_number: "",

  });
  const dispatch = useDispatch();
  const [registering, setReistering] = useState(false);
  const toggleRegistering = () => {
    dispatch(clearError());
    setReistering((prevState) => !prevState);
  };
  const changeInput = (e) => {
    dispatch(clearError());
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const RegisterUser = async () => {
    try {
      await props.registerUser(user)
      toggleRegistering();
    } catch (error) {

    }

  };
  const LoginUser = async () => {
    await props.loginUser(user)
    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo.role.name === "admin") {
      return navigate("/dashboard");
    }
    else {
      return navigate("/403");
    }

  };

  const navigate = useNavigate();
  useEffect(() => {
    var userInfor = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfor) {
      return navigate("/dashboard");
    }
    else {
      return navigate("/");
    }

  }, [error])

  return (
    <div className="h-screen w-screen bg-slate-900 flex justify-center items-center">
      {registering ? (
        <Register
          toggleRegistering={toggleRegistering}
          registering={registering}
          changeInput={changeInput}
          submit={RegisterUser}
          error={error.error}
        />
      ) : (
        <LoginView
          toggleRegistering={toggleRegistering}
          registering={registering}
          changeInput={changeInput}
          loading={props.loading}
          submit={LoginUser}
          error={props.error}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    error: state.userDetails.error,
    loading: state.userDetails.loading,
    // packages: state.PackageDetails.packages
  }

};

export default connect(mapStateToProps, { loginUser })(Login);