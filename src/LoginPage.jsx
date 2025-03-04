import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <AuthForm />
    </div>
  );
  
};


export default LoginPage;
