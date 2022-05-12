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
  const navigate = useNavigate();
  const error = useSelector((state) => state.userDetails);
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    phone_number: 0,
    l_name: '',
    gender: '',
    username: ''
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
      console.log(error)
    }

  };
  const LoginUser = () => {
    dispatch(loginUser(user));

    return navigate("/dashboard");
  };
  useEffect(() => {

  }, [error]);
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
          submit={LoginUser}
          error={error.error}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    // error: state.PackageDetails.error,
    // loading: state.PackageDetails.loading,
    // packages: state.PackageDetails.packages
  }

};

export default connect(mapStateToProps, { registerUser })(Login);