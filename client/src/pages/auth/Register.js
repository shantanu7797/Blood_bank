import React from "react";
import Form from "../../components/shared/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "../../components/shared/Spinner";

const Register = () => {
  const { loading, error } = useSelector((state) => state.auth);
  return (
    <>
      {error && <span>{alert(error)}</span>}
      {loading ? (
        <Spinner />
      ) : (
        <div className="row g-0">
          <div className="col-md-8 form-banner ">
            <img src="./assets/images/RegisterPage.png" alt="registerImage" />
          </div>
          <div className="col-md-4 form-container">
            <Form
              formTitle={"Register"}
              submitBtn={"Sign Up"}
              formType={"register"}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
